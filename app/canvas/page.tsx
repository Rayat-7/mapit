import CanvasMap from '../components/CanvasMap';
import Toolbar, { TopRightControls } from '../components/Toolbar';

export default function CanvasPage() {
  return (
    <main className="relative w-full h-screen overflow-hidden bg-zinc-50 dark:bg-zinc-900">
      <CanvasMap />
      <Toolbar isCanvas={true} />
      <TopRightControls />
    </main>
  );
}
