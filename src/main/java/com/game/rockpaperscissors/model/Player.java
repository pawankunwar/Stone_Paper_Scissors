package com.game.rockpaperscissors.model;

public class Player {
    private String name;
    private Choice choice;
    private int score;

    public Player() {}

    public Player(String name) {
        this.name = name;
        this.score = 0;
    }

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Choice getChoice() {
        return choice;
    }

    public void setChoice(Choice choice) {
        this.choice = choice;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public void incrementScore() {
        this.score++;
    }

    public void resetChoice() {
        this.choice = null;
    }

    @Override
    public String toString() {
        return "Player{" +
                "name='" + name + '\'' +
                ", choice=" + choice +
                ", score=" + score +
                '}';
    }
}
