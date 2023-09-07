
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    let render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = /* @__PURE__ */ Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        // Do not reenter flush while dirty components are updated, as this can
        // result in an infinite loop. Instead, let the inner flush handle it.
        // Reentrancy is ok afterwards for bindings etc.
        if (flushidx !== 0) {
            return;
        }
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            try {
                while (flushidx < dirty_components.length) {
                    const component = dirty_components[flushidx];
                    flushidx++;
                    set_current_component(component);
                    update(component.$$);
                }
            }
            catch (e) {
                // reset dirty state to not end up in a deadlocked state and then rethrow
                dirty_components.length = 0;
                flushidx = 0;
                throw e;
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    /**
     * Useful for example to execute remaining `afterUpdate` callbacks before executing `destroy`.
     */
    function flush_render_callbacks(fns) {
        const filtered = [];
        const targets = [];
        render_callbacks.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
        targets.forEach((c) => c());
        render_callbacks = filtered;
    }
    const outroing = new Set();
    let outros;
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
                // if the component was destroyed immediately
                // it will update the `$$.on_destroy` reference to `null`.
                // the destructured on_destroy may still reference to the old array
                if (component.$$.on_destroy) {
                    component.$$.on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            flush_render_callbacks($$.after_update);
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: [],
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            if (!is_function(callback)) {
                return noop;
            }
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.59.2' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation, has_stop_immediate_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        if (has_stop_immediate_propagation)
            modifiers.push('stopImmediatePropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src/components/Header.svelte generated by Svelte v3.59.2 */

    const file$2 = "src/components/Header.svelte";

    function create_fragment$2(ctx) {
    	let header;
    	let h2;

    	const block = {
    		c: function create() {
    			header = element("header");
    			h2 = element("h2");
    			h2.textContent = "Log your entry";
    			attr_dev(h2, "class", "svelte-1p6areh");
    			add_location(h2, file$2, 4, 4, 33);
    			attr_dev(header, "class", "svelte-1p6areh");
    			add_location(header, file$2, 3, 0, 20);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			append_dev(header, h2);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Header', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Header> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/components/Footer.svelte generated by Svelte v3.59.2 */

    const file$1 = "src/components/Footer.svelte";

    function create_fragment$1(ctx) {
    	let footer;
    	let div0;
    	let t1;
    	let div1;
    	let p;
    	let t3;
    	let a0;
    	let t5;
    	let a1;
    	let t7;
    	let a2;

    	const block = {
    		c: function create() {
    			footer = element("footer");
    			div0 = element("div");
    			div0.textContent = "Copyright 2021";
    			t1 = space();
    			div1 = element("div");
    			p = element("p");
    			p.textContent = "Images:";
    			t3 = space();
    			a0 = element("a");
    			a0.textContent = "Earth";
    			t5 = text(",\n        ");
    			a1 = element("a");
    			a1.textContent = "Planet Images";
    			t7 = text(",\n        ");
    			a2 = element("a");
    			a2.textContent = "Pluto";
    			attr_dev(div0, "class", "copyright svelte-1lzpqbt");
    			add_location(div0, file$1, 1, 4, 13);
    			add_location(p, file$1, 3, 8, 92);
    			attr_dev(a0, "href", "https://pixabay.com");
    			add_location(a0, file$1, 4, 8, 115);
    			attr_dev(a1, "href", "https://space-facts.com/transparent-planet-pictures/");
    			add_location(a1, file$1, 5, 8, 164);
    			attr_dev(a2, "href", "http://clipart-library.com/planet-pluto-cliparts.html");
    			add_location(a2, file$1, 6, 8, 254);
    			attr_dev(div1, "class", "freebes");
    			add_location(div1, file$1, 2, 4, 62);
    			attr_dev(footer, "class", "svelte-1lzpqbt");
    			add_location(footer, file$1, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, footer, anchor);
    			append_dev(footer, div0);
    			append_dev(footer, t1);
    			append_dev(footer, div1);
    			append_dev(div1, p);
    			append_dev(div1, t3);
    			append_dev(div1, a0);
    			append_dev(div1, t5);
    			append_dev(div1, a1);
    			append_dev(div1, t7);
    			append_dev(div1, a2);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(footer);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Footer', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Footer> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Footer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Footer",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.59.2 */

    const { console: console_1 } = globals;
    const file = "src/App.svelte";

    function create_fragment(ctx) {
    	let link;
    	let t0;
    	let header;
    	let t1;
    	let main;
    	let div4;
    	let div0;
    	let img;
    	let img_src_value;
    	let t2;
    	let div3;
    	let div2;
    	let p0;
    	let t3;
    	let input;
    	let t4;
    	let p1;
    	let t5;
    	let p2;
    	let button;
    	let t7;
    	let div1;
    	let t8;
    	let b;
    	let t10;
    	let h2;
    	let t11;
    	let t12;
    	let footer;
    	let current;
    	let mounted;
    	let dispose;
    	header = new Header({ $$inline: true });
    	footer = new Footer({ $$inline: true });

    	const block = {
    		c: function create() {
    			link = element("link");
    			t0 = space();
    			create_component(header.$$.fragment);
    			t1 = space();
    			main = element("main");
    			div4 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t2 = space();
    			div3 = element("div");
    			div2 = element("div");
    			p0 = element("p");
    			t3 = text("Enter planet name : ");
    			input = element("input");
    			t4 = space();
    			p1 = element("p");
    			t5 = space();
    			p2 = element("p");
    			button = element("button");
    			button.textContent = "Log";
    			t7 = space();
    			div1 = element("div");
    			t8 = text("You will love to know how ");
    			b = element("b");
    			b.textContent = "Earthly";
    			t10 = text(" sees you: ");
    			h2 = element("h2");
    			t11 = text(/*facts*/ ctx[2]);
    			t12 = space();
    			create_component(footer.$$.fragment);
    			attr_dev(link, "href", "https://fonts.googleapis.com/css?family=Electrolize");
    			attr_dev(link, "rel", "stylesheet");
    			add_location(link, file, 41, 2, 2086);
    			if (!src_url_equal(img.src, img_src_value = /*planetimg*/ ctx[1])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "earth planet");
    			attr_dev(img, "width", "250px");
    			attr_dev(img, "height", "250px");
    			add_location(img, file, 46, 6, 2229);
    			add_location(div0, file, 46, 1, 2224);
    			attr_dev(input, "type", "text");
    			add_location(input, file, 49, 26, 2367);
    			add_location(p0, file, 49, 3, 2344);
    			attr_dev(p1, "class", "logentry");
    			add_location(p1, file, 50, 3, 2417);
    			add_location(button, file, 51, 6, 2471);
    			add_location(p2, file, 51, 3, 2468);
    			add_location(b, file, 53, 34, 2556);
    			add_location(h2, file, 53, 59, 2581);
    			add_location(div1, file, 53, 3, 2525);
    			attr_dev(div2, "class", "border-5");
    			add_location(div2, file, 48, 2, 2317);
    			add_location(div3, file, 47, 1, 2309);
    			attr_dev(div4, "class", "center svelte-fk5kae");
    			add_location(div4, file, 45, 0, 2202);
    			attr_dev(main, "class", "svelte-fk5kae");
    			add_location(main, file, 44, 0, 2195);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document.head, link);
    			insert_dev(target, t0, anchor);
    			mount_component(header, target, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, div4);
    			append_dev(div4, div0);
    			append_dev(div0, img);
    			append_dev(div4, t2);
    			append_dev(div4, div3);
    			append_dev(div3, div2);
    			append_dev(div2, p0);
    			append_dev(p0, t3);
    			append_dev(p0, input);
    			set_input_value(input, /*message*/ ctx[0]);
    			append_dev(div2, t4);
    			append_dev(div2, p1);
    			p1.innerHTML = /*greetingMessage*/ ctx[3];
    			append_dev(div2, t5);
    			append_dev(div2, p2);
    			append_dev(p2, button);
    			append_dev(div2, t7);
    			append_dev(div2, div1);
    			append_dev(div1, t8);
    			append_dev(div1, b);
    			append_dev(div1, t10);
    			append_dev(div1, h2);
    			append_dev(h2, t11);
    			insert_dev(target, t12, anchor);
    			mount_component(footer, target, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[5]),
    					listen_dev(button, "click", /*handleClick*/ ctx[4], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*planetimg*/ 2 && !src_url_equal(img.src, img_src_value = /*planetimg*/ ctx[1])) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*message*/ 1 && input.value !== /*message*/ ctx[0]) {
    				set_input_value(input, /*message*/ ctx[0]);
    			}

    			if (!current || dirty & /*greetingMessage*/ 8) p1.innerHTML = /*greetingMessage*/ ctx[3];			if (!current || dirty & /*facts*/ 4) set_data_dev(t11, /*facts*/ ctx[2]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			transition_in(footer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			transition_out(footer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			detach_dev(link);
    			if (detaching) detach_dev(t0);
    			destroy_component(header, detaching);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(main);
    			if (detaching) detach_dev(t12);
    			destroy_component(footer, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let todaysdate;
    	let greetingMessage;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let stardate = new Date();
    	let message = "";
    	let planetGreet = 'to Earth';
    	let planetimg = '/img/earth-planet.png';
    	let facts = 'It is a beautiful day today here';

    	let planet_details = [
    		{
    			id: 1,
    			pname: 'Mercury',
    			greeting: 'Mercurian',
    			efact: 'Messenger of the Roman gods',
    			imgsrc: '/img/mercury.png'
    		},
    		{
    			id: 2,
    			pname: 'Venus',
    			greeting: 'Venusian',
    			efact: 'Roman goddess of love and beauty',
    			imgsrc: '/img/venus.png'
    		},
    		{
    			id: 3,
    			pname: 'Earth',
    			greeting: 'Earthly',
    			efact: 'Earth is the only planet that was not named after a Greek or Roman god or goddess',
    			imgsrc: '/img/earth-planet.png'
    		},
    		{
    			id: 4,
    			pname: 'Mars',
    			greeting: 'Martian',
    			efact: 'Roman god of war',
    			imgsrc: '/img/mars.png'
    		},
    		{
    			id: 5,
    			pname: 'Jupiter',
    			greeting: 'Jovian',
    			efact: 'Ruler of the Roman gods',
    			imgsrc: '/img/jupiter.png'
    		},
    		{
    			id: 6,
    			pname: 'Saturn',
    			greeting: 'Cronian',
    			efact: 'Roman god of agriculture',
    			imgsrc: '/img/saturn.png'
    		},
    		{
    			id: 7,
    			pname: 'Uranus',
    			greeting: 'Caelian',
    			efact: 'Personification of heaven in ancient myth',
    			imgsrc: '/img/uranus.png'
    		},
    		{
    			id: 8,
    			pname: 'Neptune',
    			greeting: 'Neptunian',
    			efact: 'Roman god of water',
    			imgsrc: '/img/neptune.png'
    		},
    		{
    			id: 9,
    			pname: 'Pluto',
    			greeting: 'Plutonian',
    			efact: 'Roman god of underworld, Hades',
    			imgsrc: '/img/pluto.png'
    		}
    	];

    	const handleClick = () => {
    		console.log(message);
    		const planet = planet_details.filter(item => item.pname.toLowerCase() == message.toLowerCase());

    		if (planet.length == 0) {
    			$$invalidate(3, greetingMessage = 'Hang in there!');
    			$$invalidate(1, planetimg = '/img/startrek.jpg');
    			$$invalidate(2, facts = 'You are diffcult to locate, try again or register your planet');
    		} else {
    			$$invalidate(3, greetingMessage = `<b>${planet[0].greeting}</b>, ${todaysdate} your entry is logged`);
    			$$invalidate(1, planetimg = planet[0].imgsrc);
    			$$invalidate(2, facts = planet[0].efact);
    		}
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		message = this.value;
    		$$invalidate(0, message);
    	}

    	$$self.$capture_state = () => ({
    		Header,
    		Footer,
    		stardate,
    		message,
    		planetGreet,
    		planetimg,
    		facts,
    		planet_details,
    		handleClick,
    		todaysdate,
    		greetingMessage
    	});

    	$$self.$inject_state = $$props => {
    		if ('stardate' in $$props) $$invalidate(7, stardate = $$props.stardate);
    		if ('message' in $$props) $$invalidate(0, message = $$props.message);
    		if ('planetGreet' in $$props) $$invalidate(8, planetGreet = $$props.planetGreet);
    		if ('planetimg' in $$props) $$invalidate(1, planetimg = $$props.planetimg);
    		if ('facts' in $$props) $$invalidate(2, facts = $$props.facts);
    		if ('planet_details' in $$props) planet_details = $$props.planet_details;
    		if ('todaysdate' in $$props) todaysdate = $$props.todaysdate;
    		if ('greetingMessage' in $$props) $$invalidate(3, greetingMessage = $$props.greetingMessage);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	todaysdate = `${stardate.getFullYear()}${stardate.getMonth()}${stardate.getDate()}T${stardate.getHours()}${stardate.getMinutes()}${stardate.getSeconds()}`;
    	$$invalidate(3, greetingMessage = `Welcome ${planetGreet}`);
    	return [message, planetimg, facts, greetingMessage, handleClick, input_input_handler];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
