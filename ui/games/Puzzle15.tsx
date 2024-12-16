import { Grid, Box, Flex, Button } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import React, { useState, useEffect, useCallback, useRef } from 'react';

const getPossibleMoves = (emptyIndex: number): Array<number> => {

  const moves: Array<number> = [];
  const row = Math.floor(emptyIndex / 4);
  const col = emptyIndex % 4;

  if (row > 0) {
    // Move tile from above into the empty space
    moves.push((row - 1) * 4 + col);
  }
  if (row < 3) {
    // Move tile from below into the empty space
    moves.push((row + 1) * 4 + col);
  }
  if (col > 0) {
    // Move tile from the left into the empty space
    moves.push(row * 4 + (col - 1));
  }
  if (col < 3) {
    // Move tile from the right into the empty space
    moves.push(row * 4 + (col + 1));
  }

  return moves;
};

const shuffleBoard = (initialBoard: Array<number>): Array<number> => {
  const board = initialBoard.slice(); // Create a copy of the board
  let emptyIndex = board.indexOf(15);
  let lastMoveIndex = -1;

  for (let i = 0; i < 100; i++) {
    let possibleMoves = getPossibleMoves(emptyIndex);

    // Prevent immediate reversal of the last move
    if (lastMoveIndex !== -1) {
      possibleMoves = possibleMoves.filter(index => index !== lastMoveIndex);
    }

    // Randomly select a tile to move into the empty space
    const moveIndex = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];

    // Swap the selected tile with the empty space
    [ board[emptyIndex], board[moveIndex] ] = [ board[moveIndex], board[emptyIndex] ];

    // Update indices for the next iteration
    lastMoveIndex = emptyIndex;
    emptyIndex = moveIndex;
  }

  return board;
};

const Puzzle15 = () => {
  const [ tiles, setTiles ] = useState<Array<number>>(Array.from({ length: 16 }, (_, i) => i));
  const [ isWon, setIsWon ] = useState(false);
  const [ image, setImage ] = useState<HTMLImageElement | null>(null);
  const canvasRefs = useRef<Array<(HTMLCanvasElement | null)>>([]);

  const initializeGame = useCallback(() => {
    const newTiles = shuffleBoard(tiles);
    setTiles(newTiles);
    setIsWon(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    initializeGame();
  }, [ initializeGame ]);

  useEffect(() => {
    const img = new Image();
    img.src = '/static/duck.jpg';
    img.onload = () => setImage(img);
  }, []);

  useEffect(() => {
    if (image) {
      tiles.forEach((tile, index) => {
        const canvas = canvasRefs.current[index];
        if (canvas) {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            const tileSize = image.width / 4;
            const srcX = (tile % 4) * tileSize;
            const srcY = Math.floor(tile / 4) * tileSize;
            ctx.drawImage(
              image,
              srcX,
              srcY,
              tileSize,
              tileSize,
              0,
              0,
              canvas.width,
              canvas.height,
            );
          }
        }
      });
    }
  }, [ tiles, image ]);

  const isAdjacent = React.useCallback((index1: number, index2: number) => {
    const row1 = Math.floor(index1 / 4);
    const col1 = index1 % 4;
    const row2 = Math.floor(index2 / 4);
    const col2 = index2 % 4;
    return Math.abs(row1 - row2) + Math.abs(col1 - col2) === 1;
  }, []);

  const checkWinCondition = useCallback((currentTiles: Array<number>) => {
    setIsWon(currentTiles.every((tile, index) => tile === index));
  }, []);

  const moveTile = useCallback((index: number) => {
    const emptyIndex = tiles.indexOf(15);
    if (isAdjacent(index, emptyIndex)) {
      const newTiles = [ ...tiles ];
      [ newTiles[index], newTiles[emptyIndex] ] = [ newTiles[emptyIndex], newTiles[index] ];
      setTiles(newTiles);
      checkWinCondition(newTiles);
    }
  }, [ tiles, isAdjacent, checkWinCondition ]);

  const handleTileClick = useCallback((index: number) => () => {
    if (!isWon) {
      moveTile(index);
    }
  }, [ isWon, moveTile ]);

  return (
    <Flex flexDirection="column" alignItems="center" justifyContent="center">
      <Grid templateColumns="repeat(4, 1fr)" w="400px" h="400px">
        { tiles.map((tile, index) => (
          <motion.div
            key={ tile }
            layout
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onClick={ handleTileClick(index) }
          >
            <Box position="relative">
              <canvas
                ref={ (el) => (canvasRefs.current[index] = el) }
                width="100"
                height="100"
                style={{
                  display: tile !== 15 ? 'block' : 'none',
                  border: '1px solid gray',
                }}
              />
              <Box
                position="absolute"
                top="0"
                left="0"
                right="0"
                bottom="0"
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontSize="3xl"
                fontWeight="bold"
                color="white"
                opacity="0"
                _hover={{ opacity: 0.3 }}
                transition="opacity 0.2s"
              >
                { tile !== 15 && tile + 1 }
              </Box>
            </Box>
          </motion.div>
        )) }
      </Grid>
      { isWon && <Button mt={ 10 }>Claim NFT</Button> }
    </Flex>
  );
};

export default Puzzle15;
