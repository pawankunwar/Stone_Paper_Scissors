package com.game.rockpaperscissors.service;

import com.game.rockpaperscissors.model.*;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class GameService {
    
    private final Map<String, GameSession> gameSessions = new ConcurrentHashMap<>();

    public GameSession createNewGame() {
        String sessionId = UUID.randomUUID().toString();
        GameSession session = new GameSession(sessionId);
        gameSessions.put(sessionId, session);
        return session;
    }

    public GameSession getGameSession(String sessionId) {
        return gameSessions.get(sessionId);
    }

    public GameSession initializePlayers(String sessionId, String player1Name, String player2Name) {
        GameSession session = getGameSession(sessionId);
        if (session == null) {
            throw new IllegalArgumentException("Game session not found");
        }

        session.setPlayer1(new Player(player1Name.trim()));
        session.setPlayer2(new Player(player2Name.trim()));
        session.setGameState(GameState.PLAYER1_TURN);
        
        return session;
    }

    public GameSession makeChoice(String sessionId, int playerNumber, String choice) {
        GameSession session = getGameSession(sessionId);
        if (session == null) {
            throw new IllegalArgumentException("Game session not found");
        }

        Choice playerChoice = Choice.fromString(choice);
        
        if (playerNumber == 1 && session.getGameState() == GameState.PLAYER1_TURN) {
            session.getPlayer1().setChoice(playerChoice);
            session.setGameState(GameState.PLAYER2_TURN);
        } else if (playerNumber == 2 && session.getGameState() == GameState.PLAYER2_TURN) {
            session.getPlayer2().setChoice(playerChoice);
            session.setGameState(GameState.COUNTDOWN);
        } else {
            throw new IllegalStateException("Invalid player turn or game state");
        }

        return session;
    }

    public GameResult playRound(String sessionId) {
        GameSession session = getGameSession(sessionId);
        if (session == null) {
            throw new IllegalArgumentException("Game session not found");
        }

        if (!session.bothPlayersChosen()) {
            throw new IllegalStateException("Both players must make their choices");
        }

        Player player1 = session.getPlayer1();
        Player player2 = session.getPlayer2();
        Choice choice1 = player1.getChoice();
        Choice choice2 = player2.getChoice();

        GameResult result;

        if (choice1 == choice2) {
            // Tie
            result = new GameResult("🤝 It's a Tie! 🤝");
        } else if (choice1.beats(choice2)) {
            // Player 1 wins
            player1.incrementScore();
            result = new GameResult(player1, player2, "🎉 " + player1.getName() + " Wins! 🎉");
        } else {
            // Player 2 wins
            player2.incrementScore();
            result = new GameResult(player2, player1, "🎉 " + player2.getName() + " Wins! 🎉");
        }

        session.setLastResult(result);
        session.setGameState(GameState.BATTLE_RESULT);
        
        return result;
    }

    public GameSession startNewRound(String sessionId) {
        GameSession session = getGameSession(sessionId);
        if (session == null) {
            throw new IllegalArgumentException("Game session not found");
        }

        session.resetChoices();
        session.setGameState(GameState.PLAYER1_TURN);
        session.setLastResult(null);
        
        return session;
    }

    public GameSession resetGame(String sessionId) {
        GameSession session = getGameSession(sessionId);
        if (session == null) {
            throw new IllegalArgumentException("Game session not found");
        }

        session.resetGame();
        return session;
    }

    public void removeGameSession(String sessionId) {
        gameSessions.remove(sessionId);
    }

    public int getActiveSessionsCount() {
        return gameSessions.size();
    }
}
