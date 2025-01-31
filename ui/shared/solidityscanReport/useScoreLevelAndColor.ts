import { useColorModeValue } from '@chakra-ui/react';

export default function useScoreLevelAndColor(score: number) {
  const greatScoreColor = useColorModeValue('green.600', 'green.400');
  const averageScoreColor = useColorModeValue('purple.600', 'purple.400');
  const lowScoreColor = useColorModeValue('red.600', 'red.400');

  let scoreColor;
  let scoreLevel;
  if (score >= 80) {
    scoreColor = greatScoreColor;
    scoreLevel = 'GREAT';
  } else if (score >= 30) {
    scoreColor = averageScoreColor;
    scoreLevel = 'AVERAGE';
  } else {
    scoreColor = lowScoreColor;
    scoreLevel = 'LOW';
  }
  return { scoreColor, scoreLevel };
}
