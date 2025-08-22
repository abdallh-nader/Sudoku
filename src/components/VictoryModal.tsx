import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trophy, Star, Clock, Target } from 'lucide-react';

interface VictoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameType: 'sudoku' | 'graph' | 'both';
  time: number;
  difficulty: string;
  errors: number;
}

const VictoryModal: React.FC<VictoryModalProps> = ({
  isOpen,
  onClose,
  gameType,
  time,
  difficulty,
  errors
}) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTitle = () => {
    switch (gameType) {
      case 'sudoku': return '🎉 تم حل السودوكو!';
      case 'graph': return '🌟 تم حل تحدي التلوين!';
      case 'both': return '👑 تم إنجاز التحديين!';
      default: return '🎊 مبروك!';
    }
  };

  const getMessage = () => {
    switch (gameType) {
      case 'sudoku': return 'أحسنت! لقد حللت لغز السودوكو بنجاح';
      case 'graph': return 'ممتاز! لقد نجحت في تلوين الرسم البياني';
      case 'both': return 'إنجاز مذهل! لقد أكملت كلا التحديين';
      default: return 'عمل رائع!';
    }
  };

  const getStarRating = () => {
    let stars = 3; // Default 3 stars
    
    if (errors === 0) stars = 5;
    else if (errors <= 2) stars = 4;
    else if (errors <= 5) stars = 3;
    else if (errors <= 10) stars = 2;
    else stars = 1;

    return stars;
  };

  const stars = getStarRating();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md text-center">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary flex items-center justify-center gap-2">
            <Trophy className="w-6 h-6 text-warning" />
            {getTitle()}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Victory animation */}
          <div className="animate-victory">
            <div className="text-6xl mb-4">
              {gameType === 'both' ? '👑' : gameType === 'sudoku' ? '🧩' : '🎨'}
            </div>
          </div>

          {/* Message */}
          <p className="text-lg text-muted-foreground">
            {getMessage()}
          </p>

          {/* Star Rating */}
          <div className="flex justify-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-6 h-6 ${
                  i < stars 
                    ? 'text-warning fill-warning' 
                    : 'text-muted-foreground'
                }`}
              />
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="flex flex-col items-center gap-1">
              <Clock className="w-5 h-5 text-primary" />
              <span className="text-sm text-muted-foreground">الوقت</span>
              <span className="font-bold text-primary">{formatTime(time)}</span>
            </div>
            
            <div className="flex flex-col items-center gap-1">
              <Target className="w-5 h-5 text-secondary" />
              <span className="text-sm text-muted-foreground">المستوى</span>
              <span className="font-bold text-secondary capitalize">{difficulty}</span>
            </div>
            
            <div className="flex flex-col items-center gap-1">
              <Trophy className="w-5 h-5 text-warning" />
              <span className="text-sm text-muted-foreground">الأخطاء</span>
              <span className="font-bold text-error">{errors}</span>
            </div>
          </div>

          {/* Performance message */}
          <div className="text-sm text-muted-foreground">
            {stars === 5 && "أداء مثالي! بدون أخطاء! 🌟"}
            {stars === 4 && "أداء ممتاز! أخطاء قليلة جداً 👏"}
            {stars === 3 && "أداء جيد! يمكنك تحسين دقتك 👍"}
            {stars === 2 && "أداء لا بأس به، تحتاج المزيد من التركيز 💪"}
            {stars === 1 && "أداء يحتاج تحسين، لكن المهم أنك أنجزت! 🎯"}
          </div>

          {/* Close button */}
          <Button 
            onClick={onClose} 
            className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
          >
            متابعة اللعب
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VictoryModal;