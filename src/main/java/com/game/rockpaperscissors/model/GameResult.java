package com.game.rockpaperscissors.model;

public class GameResult {
    private Player winner;
    private Player loser;
    private boolean isTie;
    private String message;

    public GameResult() {}

    public GameResult(Player winner, Player loser, String message) {
        this.winner = winner;
        this.loser = loser;
        this.isTie = false;
        this.message = message;
    }

    public GameResult(String message) {
        this.isTie = true;
        this.message = message;
    }

    // Getters and Setters
    public Player getWinner() {
        return winner;
    }

    public void setWinner(Player winner) {
        this.winner = winner;
    }

    public Player getLoser() {
        return loser;
    }

    public void setLoser(Player loser) {
        this.loser = loser;
    }

    public boolean isTie() {
        return isTie;
    }

    public void setTie(boolean tie) {
        isTie = tie;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
