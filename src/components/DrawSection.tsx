import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { Download, Eraser, Paintbrush, RotateCcw, Star, Trash2 } from 'lucide-react';
import {
  canClaimDailyDrawingStar,
  DRAWING_DAILY_STARS,
  DRAWING_MIN_STROKES,
  getTodayKey,
} from '../utils/progression';

interface DrawSectionProps {
  drawingsSaved: number;
  lastDrawingStarDate: string;
  onSaveDrawing: (strokeCount: number) => boolean;
}

type ColoringTemplateId = 'blank' | 'sun' | 'apple' | 'house' | 'butterfly' | 'sailboat';

interface Stroke {
  color: string;
  size: number;
  points: { x: number; y: number }[];
}

const CRAYON_COLORS = [
  { name: 'Sky Blue', hex: '#0284C7' },
  { name: 'Apple Red', hex: '#E11D48' },
  { name: 'Sunny Yellow', hex: '#F59E0B' },
  { name: 'Leaf Green', hex: '#059669' },
  { name: 'Tangerine', hex: '#EA580C' },
  { name: 'Grape', hex: '#7C3AED' },
  { name: 'Rose Pink', hex: '#EC4899' },
  { name: 'Earth Brown', hex: '#92400E' },
  { name: 'Charcoal', hex: '#1E293B' },
  { name: 'Mint', hex: '#14B8A6' },
];

const BRUSH_SIZES = [
  { id: 'small', label: 'Small', px: 6 },
  { id: 'medium', label: 'Medium', px: 14 },
  { id: 'big', label: 'Big', px: 26 },
];

const TEMPLATES: { id: ColoringTemplateId; label: string }[] = [
  { id: 'blank', label: 'Blank Paper' },
  { id: 'sun', label: 'Happy Sun' },
  { id: 'apple', label: 'Big Apple' },
  { id: 'house', label: 'Cozy House' },
  { id: 'butterfly', label: 'Butterfly' },
  { id: 'sailboat', label: 'Sailboat' },
];

function drawTemplateOutline(
  ctx: CanvasRenderingContext2D,
  template: ColoringTemplateId,
  w: number,
  h: number,
) {
  if (template === 'blank') return;

  ctx.save();
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const cx = w / 2;
  const cy = h / 2;

  if (template === 'sun') {
    const r = Math.min(w, h) * 0.22;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();

    // Rays
    for (let i = 0; i < 12; i++) {
      const angle = (i * Math.PI * 2) / 12;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(angle) * (r + 16), cy + Math.sin(angle) * (r + 16));
      ctx.lineTo(cx + Math.cos(angle) * (r + 48), cy + Math.sin(angle) * (r + 48));
      ctx.stroke();
    }

    // Friendly face
    ctx.beginPath();
    ctx.arc(cx - r * 0.32, cy - r * 0.15, 5, 0, Math.PI * 2);
    ctx.arc(cx + r * 0.32, cy - r * 0.15, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#334155';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(cx, cy + r * 0.08, r * 0.36, 0.15 * Math.PI, 0.85 * Math.PI);
    ctx.stroke();
  } else if (template === 'apple') {
    const scale = Math.min(w, h) / 420;
    ctx.translate(cx, cy + 16 * scale);
    ctx.scale(scale, scale);

    ctx.beginPath();
    ctx.moveTo(0, -78);
    ctx.bezierCurveTo(-90, -110, -130, 10, -70, 95);
    ctx.bezierCurveTo(-30, 125, -8, 102, 0, 96);
    ctx.bezierCurveTo(8, 102, 30, 125, 70, 95);
    ctx.bezierCurveTo(130, 10, 90, -110, 0, -78);
    ctx.closePath();
    ctx.stroke();

    // Stem
    ctx.beginPath();
    ctx.moveTo(0, -78);
    ctx.quadraticCurveTo(6, -124, 24, -138);
    ctx.stroke();

    // Leaf
    ctx.beginPath();
    ctx.moveTo(10, -106);
    ctx.quadraticCurveTo(62, -138, 76, -92);
    ctx.quadraticCurveTo(36, -78, 10, -106);
    ctx.stroke();
  } else if (template === 'house') {
    const bw = Math.min(w * 0.48, 300);
    const bh = Math.min(h * 0.42, 180);
    const left = cx - bw / 2;
    const top = cy - bh * 0.15;

    // Wall
    ctx.strokeRect(left, top, bw, bh);

    // Roof
    ctx.beginPath();
    ctx.moveTo(left - 24, top);
    ctx.lineTo(cx, top - bh * 0.65);
    ctx.lineTo(left + bw + 24, top);
    ctx.closePath();
    ctx.stroke();

    // Door
    ctx.strokeRect(cx - bw * 0.12, top + bh * 0.45, bw * 0.24, bh * 0.55);

    // Windows
    ctx.strokeRect(left + bw * 0.12, top + bh * 0.2, bw * 0.2, bh * 0.26);
    ctx.strokeRect(left + bw * 0.68, top + bh * 0.2, bw * 0.2, bh * 0.26);
  } else if (template === 'butterfly') {
    const scale = Math.min(w, h) / 420;
    ctx.translate(cx, cy);
    ctx.scale(scale, scale);

    // Left & Right upper wings
    ctx.beginPath();
    ctx.ellipse(-78, -36, 74, 52, -0.35, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(78, -36, 74, 52, 0.35, 0, Math.PI * 2);
    ctx.stroke();

    // Left & Right lower wings
    ctx.beginPath();
    ctx.ellipse(-62, 52, 52, 40, 0.35, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(62, 52, 52, 40, -0.35, 0, Math.PI * 2);
    ctx.stroke();

    // Body
    ctx.beginPath();
    ctx.ellipse(0, 10, 16, 78, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.stroke();

    // Antennae
    ctx.beginPath();
    ctx.moveTo(-6, -66);
    ctx.quadraticCurveTo(-24, -108, -42, -98);
    ctx.moveTo(6, -66);
    ctx.quadraticCurveTo(24, -108, 42, -98);
    ctx.stroke();
  } else if (template === 'sailboat') {
    const scale = Math.min(w, h) / 420;
    ctx.translate(cx, cy);
    ctx.scale(scale, scale);

    // Boat hull
    ctx.beginPath();
    ctx.moveTo(-130, 48);
    ctx.lineTo(130, 48);
    ctx.lineTo(92, 106);
    ctx.lineTo(-92, 106);
    ctx.closePath();
    ctx.stroke();

    // Mast
    ctx.beginPath();
    ctx.moveTo(0, 48);
    ctx.lineTo(0, -124);
    ctx.stroke();

    // Big sail
    ctx.beginPath();
    ctx.moveTo(8, -112);
    ctx.lineTo(112, 34);
    ctx.lineTo(8, 34);
    ctx.closePath();
    ctx.stroke();

    // Small sail
    ctx.beginPath();
    ctx.moveTo(-8, -88);
    ctx.lineTo(-92, 34);
    ctx.lineTo(-8, 34);
    ctx.closePath();
    ctx.stroke();

    // Gentle waves
    ctx.beginPath();
    ctx.moveTo(-160, 126);
    ctx.quadraticCurveTo(-110, 108, -60, 126);
    ctx.quadraticCurveTo(-10, 144, 40, 126);
    ctx.quadraticCurveTo(90, 108, 150, 126);
    ctx.stroke();
  }

  ctx.restore();
}

export function DrawSection({
  drawingsSaved,
  lastDrawingStarDate,
  onSaveDrawing,
}: DrawSectionProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [template, setTemplate] = useState<ColoringTemplateId>('sun');
  const [selectedColor, setSelectedColor] = useState<string>(CRAYON_COLORS[0].hex);
  const [brushSize, setBrushSize] = useState<number>(BRUSH_SIZES[1].px);
  const [tool, setTool] = useState<'brush' | 'eraser'>('brush');
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const CANVAS_W = 840;
  const CANVAS_H = 500;

  // Redraw canvas whenever strokes or template changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // White paper background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // Draw all user strokes
    for (const stroke of strokes) {
      if (stroke.points.length === 0) continue;
      ctx.save();
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.size;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      if (stroke.points.length === 1) {
        ctx.lineTo(stroke.points[0].x + 0.1, stroke.points[0].y + 0.1);
      } else {
        for (let i = 1; i < stroke.points.length; i++) {
          ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
        }
      }
      ctx.stroke();
      ctx.restore();
    }

    // Draw crisp coloring guide outline ON TOP so kids never accidentally paint over the lines!
    drawTemplateOutline(ctx, template, CANVAS_W, CANVAS_H);
  }, [strokes, template]);

  const getCanvasPoint = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = CANVAS_W / rect.width;
    const scaleY = CANVAS_H / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const handlePointerDown = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const point = getCanvasPoint(e);
    const strokeColor = tool === 'eraser' ? '#FFFFFF' : selectedColor;
    const size = tool === 'eraser' ? brushSize + 10 : brushSize;
    setIsDrawing(true);
    setSaveMessage('');
    setStrokes((prev) => [...prev, { color: strokeColor, size, points: [point] }]);
  };

  const handlePointerMove = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const point = getCanvasPoint(e);
    setStrokes((prev) => {
      if (prev.length === 0) return prev;
      const updated = [...prev];
      const last = updated[updated.length - 1];
      updated[updated.length - 1] = {
        ...last,
        points: [...last.points, point],
      };
      return updated;
    });
  };

  const handlePointerUp = () => {
    setIsDrawing(false);
  };

  const handleUndo = () => {
    setStrokes((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setStrokes([]);
    setSaveMessage('');
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `everychildlearn-art-${template}.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      // Download fallback if blocked in sandbox
    }
    const todayKey = getTodayKey();
    const check = canClaimDailyDrawingStar(lastDrawingStarDate, strokes.length, todayKey);
    const awarded = onSaveDrawing(strokes.length);
    if (awarded) {
      setSaveMessage(
        `Awesome artwork! Your drawing was saved and you earned today's +${DRAWING_DAILY_STARS} Art Stars!`,
      );
    } else if (check.reason === 'too-few-strokes') {
      setSaveMessage(
        `Drawing saved! Add at least ${DRAWING_MIN_STROKES} strokes to earn your daily +${DRAWING_DAILY_STARS} Art Stars.`,
      );
    } else {
      setSaveMessage(
        'Drawing saved! You already claimed today’s art star reward — come back tomorrow for more stars.',
      );
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-slate-900">Draw & Colour Studio</h1>
          <p className="text-slate-600 mt-1">
            Pick a colouring picture or blank paper, choose your crayons, and create art!
          </p>
        </div>

        <p className="text-sm text-slate-500 tabular-nums">
          Drawings saved: <strong className="text-slate-900">{drawingsSaved}</strong>
        </p>
      </div>

      {/* Coloring Template Selector */}
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Coloring templates">
        <span className="text-sm font-semibold text-sky-900 mr-1">Picture:</span>
        {TEMPLATES.map((tpl) => (
          <button
            key={tpl.id}
            type="button"
            onClick={() => {
              setTemplate(tpl.id);
              setStrokes([]);
              setSaveMessage('');
            }}
            aria-pressed={template === tpl.id}
            className={`px-3.5 py-2 text-sm font-semibold rounded-xl border transition-colors cursor-pointer ${
              template === tpl.id
                ? 'bg-sky-600 text-white border-sky-600'
                : 'bg-white text-sky-900 border-sky-200 hover:border-sky-400 hover:bg-sky-50'
            }`}
          >
            {tpl.label}
          </button>
        ))}
      </div>

      {/* Main Studio Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Interactive Canvas */}
        <div className="lg:col-span-9 space-y-3">
          <div className="bg-white border-2 border-sky-200 rounded-2xl p-3 shadow-xs">
            <canvas
              ref={canvasRef}
              width={CANVAS_W}
              height={CANVAS_H}
              data-testid="drawing-canvas"
              data-strokes={strokes.length}
              data-template={template}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
              className="w-full h-auto block rounded-xl border border-sky-100 touch-none cursor-crosshair bg-white"
            />
          </div>

          {saveMessage && (
            <div
              role="status"
              className="flex items-center gap-2 text-sm font-semibold text-sky-950 bg-yellow-50 border border-yellow-300 rounded-xl px-4 py-3"
            >
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-500 shrink-0" aria-hidden="true" />
              <span>{saveMessage}</span>
            </div>
          )}
        </div>

        {/* Right: Crayon Box & Controls */}
        <aside
          aria-label="Drawing tools"
          className="lg:col-span-3 bg-white border border-sky-200 rounded-2xl p-5 space-y-6"
        >
          {/* Tool Mode */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-500">Tool</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTool('brush')}
                aria-pressed={tool === 'brush'}
                className={`inline-flex items-center justify-center gap-2 py-2.5 px-3 text-sm font-semibold rounded-xl border cursor-pointer ${
                  tool === 'brush'
                    ? 'bg-sky-600 text-white border-sky-600'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Paintbrush className="w-4 h-4" aria-hidden="true" />
                <span>Crayon</span>
              </button>
              <button
                type="button"
                onClick={() => setTool('eraser')}
                aria-pressed={tool === 'eraser'}
                className={`inline-flex items-center justify-center gap-2 py-2.5 px-3 text-sm font-semibold rounded-xl border cursor-pointer ${
                  tool === 'eraser'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Eraser className="w-4 h-4" aria-hidden="true" />
                <span>Eraser</span>
              </button>
            </div>
          </div>

          {/* Color Palette */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-500">Crayon Colours</p>
            <div className="grid grid-cols-5 gap-2">
              {CRAYON_COLORS.map((c) => {
                const active = tool === 'brush' && selectedColor === c.hex;
                return (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => {
                      setSelectedColor(c.hex);
                      setTool('brush');
                    }}
                    aria-label={`Select colour ${c.name}`}
                    aria-pressed={active}
                    className={`w-9 h-9 mx-auto rounded-full transition-transform cursor-pointer ${
                      active ? 'ring-3 ring-offset-2 ring-sky-600 scale-105' : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: c.hex }}
                  />
                );
              })}
            </div>
          </div>

          {/* Brush Size */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-500">Brush Size</p>
            <div className="grid grid-cols-3 gap-2">
              {BRUSH_SIZES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setBrushSize(s.px)}
                  aria-pressed={brushSize === s.px}
                  className={`py-2 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                    brushSize === s.px
                      ? 'bg-sky-50 text-sky-800 border-sky-400'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2.5 pt-3 border-t border-slate-100">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleUndo}
                disabled={strokes.length === 0}
                className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" aria-hidden="true" />
                <span>Undo</span>
              </button>
              <button
                type="button"
                onClick={handleClear}
                disabled={strokes.length === 0}
                className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 text-sm font-medium text-rose-700 bg-white border border-slate-200 rounded-xl hover:bg-rose-50 disabled:opacity-40 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" aria-hidden="true" />
                <span>Clear</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleSave}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 text-sm font-bold text-slate-950 bg-yellow-400 rounded-xl hover:bg-yellow-300 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" aria-hidden="true" />
              <span>
                {lastDrawingStarDate === getTodayKey()
                  ? 'Save Drawing (PNG)'
                  : `Save Art (+${DRAWING_DAILY_STARS} ★/day)`}
              </span>
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
