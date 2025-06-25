package com.game.rockpaperscissors.service;

import com.game.rockpaperscissors.model.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class GameServiceTest {

    private GameService gameService;

    @BeforeEach
    void setUp() {
        gameService = new GameService();
    }

    @Test
    void testCreateNewGame() {
        GameSession session = gameService.createNewGame();
        
        assertNotNull(session);
        assertNotNull(session.getSessionId());
        assertEquals(GameState.WAITING_FOR_NAMES, session.getGameState());
    }

    @Test
    void testInitializePlayers() {
        GameSession session = gameService.createNewGame();
        String sessionId = session.getSessionId();
        
        GameSession updatedSession = gameService.initializePlayers(sessionId, "Alice", "Bob");
        
        assertNotNull(updatedSession.getPlayer1());
        assertNotNull(updatedSession.getPlayer2());
        assertEquals("Alice", updatedSession.getPlayer1().getName());
        assertEquals("Bob", updatedSession.getPlayer2().getName());
        assertEquals(GameState.PLAYER1_TURN, updatedSession.getGameState());
    }

    @Test
    void testMakeChoice() {
        GameSession session = gameService.createNewGame();
        String sessionId = session.getSessionId();
        gameService.initializePlayers(sessionId, "Alice", "Bob");
        
        // Player 1 makes choice
        GameSession updatedSession = gameService.makeChoice(sessionId, 1, "rock");
        assertEquals(Choice.ROCK, updatedSession.getPlayer1().getChoice());
        assertEquals(GameState.PLAYER2_TURN, updatedSession.getGameState());
        
        // Player 2 makes choice
        updatedSession = gameService.makeChoice(sessionId, 2, "scissors");
        assertEquals(Choice.SCISSORS, updatedSession.getPlayer2().getChoice());
        assertEquals(GameState.COUNTDOWN, updatedSession.getGameState());
    }

    @Test
    void testPlayRound() {
        GameSession session = gameService.createNewGame();
        String sessionId = session.getSessionId();
        gameService.initializePlayers(sessionId, "Alice", "Bob");
        gameService.makeChoice(sessionId, 1, "rock");
        gameService.makeChoice(sessionId, 2, "scissors");
        
        GameResult result = gameService.playRound(sessionId);
        
        assertNotNull(result);
        assertFalse(result.isTie());
        assertEquals("Alice", result.getWinner().getName());
        assertEquals("Bob", result.getLoser().getName());
        assertEquals(1, session.getPlayer1().getScore());
        assertEquals(0, session.getPlayer2().getScore());
    }

    @Test
    void testPlayRoundTie() {
        GameSession session = gameService.createNewGame();
        String sessionId = session.getSessionId();
        gameService.initializePlayers(sessionId, "Alice", "Bob");
        gameService.makeChoice(sessionId, 1, "rock");
        gameService.makeChoice(sessionId, 2, "rock");
        
        GameResult result = gameService.playRound(sessionId);
        
        assertNotNull(result);
        assertTrue(result.isTie());
        assertEquals(0, session.getPlayer1().getScore());
        assertEquals(0, session.getPlayer2().getScore());
    }

    @Test
    void testChoiceBeats() {
        assertTrue(Choice.ROCK.beats(Choice.SCISSORS));
        assertTrue(Choice.SCISSORS.beats(Choice.PAPER));
        assertTrue(Choice.PAPER.beats(Choice.ROCK));
        
        assertFalse(Choice.ROCK.beats(Choice.PAPER));
        assertFalse(Choice.SCISSORS.beats(Choice.ROCK));
        assertFalse(Choice.PAPER.beats(Choice.SCISSORS));
        
        assertFalse(Choice.ROCK.beats(Choice.ROCK));
        assertFalse(Choice.PAPER.beats(Choice.PAPER));
        assertFalse(Choice.SCISSORS.beats(Choice.SCISSORS));
    }
}
