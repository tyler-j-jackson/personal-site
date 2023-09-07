<svelte:head>
    <link rel="stylesheet" href="https://unpkg.com/@picocss/pico@latest/css/pico.min.css">
</svelte:head>

<script>
    import { text } from "@sveltejs/kit";

    let toDoList = []; // Array of ToDos
    let textInput = "";

    function setEditing(i, isEditing){
        toDoList[i].editing = isEditing; // true or false
    }

    function deleteToDo(i){
        toDoList.splice(i, 1);
        toDoList = toDoList;
    }

    function addToDo(){
        toDoList = [...toDoList, {content: textInput, editing: false, checked: false}]
    }
</script>

<div style="margin: 0 auto; padding: 20px; width: 700px;">
   <h2 style="text-align: center;">ToDo List</h2> <!-- Aligns this to the center of the screen-->
   <p>Enter your ToDo here:</p>
   <div style="display: flex;"> <!--What is display? Look up "style"-->
       <input type="text" bind:value={textInput}>
       <button style="width: 200px" on:click={addToDo}>Add</button>
   </div>
</div>

{#each toDoList as toDo, i}
 <div style="display: flex; align-items: baseline; width: 700px; margin: 0 auto;">
    {#if toDo.editing}
        <input type="text" bind:value={toDo.content}>
    {:else}
        <input type="checkbox" bind:checked={toDo.checked}>
        <h4 style="flex-grow: 1">{toDo.content}</h4>
    {/if}
    <div style="display: flex">
        {#if toDo.editing}
            <button on:click={() => setEditing(i, false)}>Save</button>
        {:else}
            <button on:click={() => setEditing(i, true)}>Edit</button>
        {/if}
        <button on:click={() => deleteToDo(i)}>Delete</button>
    </div>
 </div>
 {/each}