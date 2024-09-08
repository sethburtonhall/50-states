<script>
	import { ModeWatcher, toggleMode } from 'mode-watcher';

	// shadcn/ui
	import { Button } from '$components/ui/button';

	// icons
	import { Sun, Moon } from 'lucide-svelte';
</script>

<Button on:click={toggleMode} variant="outline" size="icon">
	<Moon
		class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
	/>
	<Sun
		class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
	/>
	<span class="sr-only">Toggle theme</span>
</Button>
<!-- this component watches for and loads the user's system setting -->
<ModeWatcher />
