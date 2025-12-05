import MapCanvas from '../components/MapCanvas';
import Toolbar, { TopRightControls } from '../components/Toolbar';

export default function MapPage() {
  return (
    <main className="relative w-full h-screen overflow-hidden bg-zinc-50 dark:bg-zinc-900">
      <MapCanvas />
      <Toolbar />
      <TopRightControls />
    </main>
  );
}
