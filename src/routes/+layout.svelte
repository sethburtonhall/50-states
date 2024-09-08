<script>
	import '../app.css';

	// custom components
	import { ModeWatcher } from '$components';

	// icons
	import { MapPinned } from 'lucide-svelte';
</script>

<main class="container">
	<nav class="sticky top-0 z-50 flex items-center justify-between bg-background py-6">
		<a href="/" class="text-foreground">
			<div class="flex items-center gap-4">
				<MapPinned class="h-9 w-9" />
				<h3>50 States</h3>
			</div>
		</a>
		<ul class="flex items-center justify-center gap-4">
			<li><a href="/about">About</a></li>
			<ModeWatcher />
		</ul>
	</nav>
	<slot />
</main>
