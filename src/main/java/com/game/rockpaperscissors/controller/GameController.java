package com.game.rockpaperscissors.controller;

import com.game.rockpaperscissors.model.GameResult;
import com.game.rockpaperscissors.model.GameSession;
import com.game.rockpaperscissors.service.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/game")
@CrossOrigin(origins = "*")
public class GameController {

    @Autowired
    private GameService gameService;

    @PostMapping("/new")
    public ResponseEntity<GameSession> createNewGame() {
        try {
            GameSession session = gameService.createNewGame();
            return ResponseEntity.ok(session);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{sessionId}")
    public ResponseEntity<GameSession> getGameSession(@PathVariable String sessionId) {
        try {
            GameSession session = gameService.getGameSession(sessionId);
            if (session == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(session);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{sessionId}/players")
    public ResponseEntity<GameSession> initializePlayers(
            @PathVariable String sessionId,
            @RequestBody Map<String, String> playerNames) {
        try {
            String player1Name = playerNames.get("player1Name");
            String player2Name = playerNames.get("player2Name");
            
            if (player1Name == null || player1Name.trim().isEmpty() ||
                player2Name == null || player2Name.trim().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }

            GameSession session = gameService.initializePlayers(sessionId, player1Name, player2Name);
            return ResponseEntity.ok(session);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{sessionId}/choice")
    public ResponseEntity<GameSession> makeChoice(
            @PathVariable String sessionId,
            @RequestBody Map<String, Object> choiceData) {
        try {
            int playerNumber = (Integer) choiceData.get("playerNumber");
            String choice = (String) choiceData.get("choice");

            GameSession session = gameService.makeChoice(sessionId, playerNumber, choice);
            return ResponseEntity.ok(session);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{sessionId}/play")
    public ResponseEntity<GameResult> playRound(@PathVariable String sessionId) {
        try {
            GameResult result = gameService.playRound(sessionId);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{sessionId}/new-round")
    public ResponseEntity<GameSession> startNewRound(@PathVariable String sessionId) {
        try {
            GameSession session = gameService.startNewRound(sessionId);
            return ResponseEntity.ok(session);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{sessionId}/reset")
    public ResponseEntity<GameSession> resetGame(@PathVariable String sessionId) {
        try {
            GameSession session = gameService.resetGame(sessionId);
            return ResponseEntity.ok(session);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{sessionId}")
    public ResponseEntity<Void> endGame(@PathVariable String sessionId) {
        try {
            gameService.removeGameSession(sessionId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Integer>> getStats() {
        try {
            int activeSessions = gameService.getActiveSessionsCount();
            return ResponseEntity.ok(Map.of("activeSessions", activeSessions));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/test")
    public ResponseEntity<Map<String, Object>> testGameLogic() {
        try {
            // Create a test game
            GameSession session = gameService.createNewGame();
            String sessionId = session.getSessionId();
            
            // Initialize players
            gameService.initializePlayers(sessionId, "TestPlayer1", "TestPlayer2");
            
            // Make choices
            gameService.makeChoice(sessionId, 1, "rock");
            gameService.makeChoice(sessionId, 2, "scissors");
            
            // Play round
            GameResult result = gameService.playRound(sessionId);
            
            // Get updated session
            GameSession updatedSession = gameService.getGameSession(sessionId);
            
            Map<String, Object> testResult = Map.of(
                "sessionId", sessionId,
                "result", result,
                "session", updatedSession
            );
            
            return ResponseEntity.ok(testResult);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
