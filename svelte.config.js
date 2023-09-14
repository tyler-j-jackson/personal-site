import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';
import { mdsvex } from 'mdsvex';
import tailwindcss from 'tailwindcss';

/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexOptions = {
    extensions: ['.md'],
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
    extensions: ['.svelte', '.md'],
    // Consult https://github.com/sveltejs/svelte-preprocess
    // for more information about preprocessors
    preprocess: [
        preprocess({
            postcss: {
                plugins: [tailwindcss],
            },
        }),
        mdsvex(mdsvexOptions),
    ],

    kit: {
        adapter: adapter({
            fallback: 'index.html',
        }),
    },
};

export default config;
