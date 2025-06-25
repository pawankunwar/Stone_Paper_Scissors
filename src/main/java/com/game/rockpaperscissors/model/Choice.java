package com.game.rockpaperscissors.model;

public enum Choice {
    ROCK("🪨", "rock"),
    PAPER("📄", "paper"),
    SCISSORS("✂️", "scissors");

    private final String emoji;
    private final String name;

    Choice(String emoji, String name) {
        this.emoji = emoji;
        this.name = name;
    }

    public String getEmoji() {
        return emoji;
    }

    public String getName() {
        return name;
    }

    public boolean beats(Choice other) {
        return switch (this) {
            case ROCK -> other == SCISSORS;
            case PAPER -> other == ROCK;
            case SCISSORS -> other == PAPER;
        };
    }

    public static Choice fromString(String choice) {
        return switch (choice.toLowerCase()) {
            case "rock" -> ROCK;
            case "paper" -> PAPER;
            case "scissors" -> SCISSORS;
            default -> throw new IllegalArgumentException("Invalid choice: " + choice);
        };
    }
}
