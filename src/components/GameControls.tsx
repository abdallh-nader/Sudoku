import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Clock, RotateCcw, CheckCircle, Lightbulb, AlertCircle, Heart } from 'lucide-react';

interface GameControlsProps {
  difficulty: 'easy' | 'medium' | 'hard';
  onDifficultyChange: (difficulty: 'easy' | 'medium' | 'hard') => void;
  onReset: () => void;
  onCheck: () => void;
  onHint: () => void;
  timer: number;
  errors: number;
  lives: number;
}

const GameControls: React.FC<GameControlsProps> = ({
  difficulty,
  onDifficultyChange,
  onReset,
  onCheck,
  onHint,
  timer,
  errors,
  lives
}) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'easy': return 'text-success';
      case 'medium': return 'text-warning';
      case 'hard': return 'text-error';
      default: return 'text-primary';
    }
  };

  return (
    <div className="game-card p-4 mb-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Left side - Difficulty and Timer */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-foreground">المستوى:</label>
            <Select value={difficulty} onValueChange={onDifficultyChange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy" className="text-success">سهل</SelectItem>
                <SelectItem value="medium" className="text-warning">متوسط</SelectItem>
                <SelectItem value="hard" className="text-error">صعب</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            <span className="text-lg font-mono font-bold text-primary">
              {formatTime(timer)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-error" />
            <span className="text-sm font-medium text-error">
              أخطاء: {errors}
            </span>
          </div>

          {/* Lives */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-destructive/10 rounded-lg border border-destructive/20">
            <Heart className={`w-4 h-4 ${lives > 0 ? 'text-destructive' : 'text-muted-foreground'}`} />
            <span className="text-sm font-medium text-destructive">{lives}</span>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Heart 
                  key={i} 
                  className={`w-3 h-3 ${i < lives ? 'text-destructive fill-destructive' : 'text-muted-foreground'}`} 
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right side - Action buttons */}
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onHint}
            className="flex items-center gap-2"
          >
            <Lightbulb className="w-4 h-4" />
            تلميحة
          </Button>
          
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={onCheck}
            className="flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            فحص الحل
          </Button>
          
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={onReset}
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            إعادة تعيين
          </Button>
        </div>
      </div>

      {/* Difficulty indicator */}
      <div className="mt-3 flex items-center gap-2">
        <div className="flex-1 bg-muted rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              difficulty === 'easy' ? 'w-1/3 bg-success' :
              difficulty === 'medium' ? 'w-2/3 bg-warning' :
              'w-full bg-error'
            }`}
          />
        </div>
        <span className={`text-xs font-medium ${getDifficultyColor(difficulty)}`}>
          {difficulty === 'easy' ? 'مبتدئ' : 
           difficulty === 'medium' ? 'متوسط' : 'خبير'}
        </span>
      </div>
    </div>
  );
};

export default GameControls;