import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import SudokuGrid from '@/components/SudokuGrid';
import GameControls from '@/components/GameControls';
import VictoryModal from '@/components/VictoryModal';
import { Sparkles, Brain, Gamepad2 } from 'lucide-react';

const Index = () => {
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [timer, setTimer] = useState(0);
  const [errors, setErrors] = useState(0);
  const [lives, setLives] = useState(5);
  const [sudokuSolved, setSudokuSolved] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [showVictory, setShowVictory] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  // Timer effect
  useEffect(() => {
    if (!gameStarted) return;

    const interval = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [gameStarted]);

  // Start game on first interaction
  useEffect(() => {
    if (!gameStarted && (timer > 0 || errors > 0)) {
      setGameStarted(true);
    }
  }, [timer, errors, gameStarted]);

  const handleSudokuSolved = () => {
    setSudokuSolved(true);
    setShowVictory(true);
    toast.success('🧩 مبروك! لقد حللت السودوكو بنجاح!', {
      duration: 5000,
    });
  };

  const handleError = () => {
    setErrors(prev => prev + 1);
    setLives(prev => {
      const newLives = prev - 1;
      if (newLives <= 0) {
        setGameOver(true);
        toast.error('💀 انتهت الأرواح! اللعبة انتهت');
      } else {
        toast.error(`❤️ خطأ! باقي ${newLives} ${newLives === 1 ? 'روح' : 'أرواح'}`);
      }
      return newLives;
    });
    if (!gameStarted) setGameStarted(true);
  };

  const handleReset = () => {
    setTimer(0);
    setErrors(0);
    setLives(5);
    setSudokuSolved(false);
    setGameStarted(false);
    setShowVictory(false);
    setGameOver(false);
    toast.info('تم إعادة تعيين اللعبة');
  };

  const handleCheck = () => {
    toast.info('تحقق من حلولك...');
  };

  const handleHint = () => {
    toast.info('💡 ابحث عن الأرقام المفقودة في كل صف وعمود!');
  };

  const handleDifficultyChange = (newDifficulty: 'easy' | 'medium' | 'hard') => {
    setDifficulty(newDifficulty);
    handleReset();
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Sudoku Color Play
            </h1>
            <Sparkles className="w-8 h-8 text-secondary" />
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            تحدِ عقلك مع لعبة السودوكو الكلاسيكية وتحدي تلوين الرسم البياني في تجربة واحدة مميزة
          </p>
        </div>

        {/* Game Controls */}
        <GameControls
          difficulty={difficulty}
          onDifficultyChange={handleDifficultyChange}
          onReset={handleReset}
          onCheck={handleCheck}
          onHint={handleHint}
          timer={timer}
          errors={errors}
          lives={lives}
        />

        {/* Progress Indicator */}
        <div className="flex justify-center mb-6">
          <div className={`flex items-center gap-2 px-6 py-3 rounded-full border-2 transition-all duration-300 ${
            sudokuSolved 
              ? 'border-success bg-success/10 text-success animate-glow' 
              : 'border-primary bg-primary/10 text-primary'
          }`}>
            <Gamepad2 className="w-5 h-5" />
            <span className="text-base font-medium">لعبة السودوكو الملونة</span>
            {sudokuSolved && <span className="text-lg">✓</span>}
          </div>
        </div>

        {/* Game Area */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-primary flex items-center justify-center gap-3 mb-6">
            <Gamepad2 className="w-8 h-8" />
            السودوكو الملون
            <Brain className="w-8 h-8" />
          </h2>
          <SudokuGrid
            difficulty={difficulty}
            onSolved={handleSudokuSolved}
            onError={handleError}
            gameOver={gameOver}
          />
        </div>

        {/* Instructions */}
        <div className="mt-12 game-card p-6 text-center max-w-2xl mx-auto">
          <h3 className="text-xl font-bold mb-4 text-primary">كيفية اللعب</h3>
          <div className="space-y-4 text-sm text-muted-foreground">
            <div>
              <h4 className="font-semibold text-foreground mb-2">🧩 السودوكو الملون</h4>
              <p>1. انقر على خانة فارغة في شبكة السودوكو</p>
              <p>2. اختر الرقم المناسب من الأرقام الملونة أسفل الشبكة</p>
              <p>3. تأكد من عدم تكرار الرقم في نفس الصف أو العمود أو المربع الصغير</p>
              <p>4. كل رقم له لون مميز لسهولة التمييز البصري</p>
            </div>
          </div>
        </div>

        {/* Victory Modal */}
        <VictoryModal
          isOpen={showVictory}
          onClose={() => setShowVictory(false)}
          gameType="sudoku"
          time={timer}
          difficulty={difficulty}
          errors={errors}
        />
      </div>
    </div>
  );
};

export default Index;
