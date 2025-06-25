package com.game.rockpaperscissors.model;

public class GameSession {
    private String sessionId;
    private Player player1;
    private Player player2;
    private GameState gameState;
    private GameResult lastResult;

    public GameSession() {
        this.gameState = GameState.WAITING_FOR_NAMES;
    }

    public GameSession(String sessionId) {
        this.sessionId = sessionId;
        this.gameState = GameState.WAITING_FOR_NAMES;
    }

    // Getters and Setters
    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public Player getPlayer1() {
        return player1;
    }

    public void setPlayer1(Player player1) {
        this.player1 = player1;
    }

    public Player getPlayer2() {
        return player2;
    }

    public void setPlayer2(Player player2) {
        this.player2 = player2;
    }

    public GameState getGameState() {
        return gameState;
    }

    public void setGameState(GameState gameState) {
        this.gameState = gameState;
    }

    public GameResult getLastResult() {
        return lastResult;
    }

    public void setLastResult(GameResult lastResult) {
        this.lastResult = lastResult;
    }

    public boolean isReadyToStart() {
        return player1 != null && player2 != null && 
               player1.getName() != null && !player1.getName().trim().isEmpty() &&
               player2.getName() != null && !player2.getName().trim().isEmpty();
    }

    public boolean bothPlayersChosen() {
        return player1 != null && player2 != null &&
               player1.getChoice() != null && player2.getChoice() != null;
    }

    public void resetChoices() {
        if (player1 != null) player1.resetChoice();
        if (player2 != null) player2.resetChoice();
    }

    public void resetGame() {
        if (player1 != null) {
            player1.setScore(0);
            player1.resetChoice();
        }
        if (player2 != null) {
            player2.setScore(0);
            player2.resetChoice();
        }
        this.gameState = GameState.WAITING_FOR_NAMES;
        this.lastResult = null;
    }
}
