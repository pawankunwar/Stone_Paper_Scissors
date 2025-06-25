<<<<<<< HEAD
# Stone_Paper_Scissors
Stone Paper Scissors game developed using Amazon Q
=======
# 🎮 Rock Paper Scissors - Spring Boot Edition

A fun, interactive Rock Paper Scissors game built with Spring Boot, featuring disco lights, sound effects, and animated celebrations!

## ✨ Features

### 🎯 Core Gameplay
- **Turn-based gameplay** - Players select choices privately
- **Personalized experience** - Custom player names throughout
- **Score tracking** - Persistent scoring across rounds
- **Real-time updates** - Instant game state synchronization

### 🎊 Victory Celebrations
- **Disco lights animation** - 8 colorful lights dancing across screen
- **Clapping sound effects** - Realistic audio using Web Audio API
- **Middle finger animation** - 4x sized emoji flying from winner to loser
- **Victory screen pulsing** - Animated celebration effects

### 🎬 Game Flow
1. **Name Entry** - Both players enter their names
2. **Player 1 Turn** - Private choice selection
3. **Player 2 Turn** - Private choice selection
4. **Countdown** - 3-2-1 with hand animations (✊✋✌️)
5. **Battle Results** - Simultaneous choice reveal
6. **Victory Celebration** - Full party experience for winners

## 🏗️ Architecture

### Backend (Spring Boot)
- **RESTful API** - Clean REST endpoints for game operations
- **Session Management** - In-memory game session storage
- **Service Layer** - Business logic separation
- **Model Classes** - Well-structured game entities
- **Error Handling** - Comprehensive exception management

### Frontend
- **Vanilla JavaScript** - No framework dependencies
- **CSS Animations** - Smooth, professional effects
- **Web Audio API** - Custom sound generation
- **Responsive Design** - Mobile and desktop compatible

## 🚀 Quick Start

### Prerequisites
- Java 17 or higher
- Maven 3.6 or higher

### Running the Application

1. **Clone/Navigate to the project directory:**
   ```bash
   cd /Users/pawan/Desktop/rock-paper-scissors-springboot
   ```

2. **Run with Maven:**
   ```bash
   ./mvnw spring-boot:run
   ```
   
   Or on Windows:
   ```bash
   mvnw.cmd spring-boot:run
   ```

3. **Open your browser:**
   ```
   http://localhost:8080
   ```

### Alternative: Run with Java
```bash
./mvnw clean package
java -jar target/rock-paper-scissors-1.0.0.jar
```

## 🎮 How to Play

1. **Enter Player Names** - Both players input their names
2. **Start Game** - Click the start button when both names are entered
3. **Player 1 Turn** - Select Rock, Paper, or Scissors privately
4. **Player 2 Turn** - Select your choice (Player 1's choice is hidden)
5. **Watch Countdown** - 3-2-1 countdown with hand animations
6. **See Results** - Choices revealed with winner announcement
7. **Enjoy Celebration** - Disco lights, sounds, and middle finger animation
8. **Play Again** - Continue with same players or reset

## 🛠️ API Endpoints

### Game Management
- `POST /api/game/new` - Create new game session
- `GET /api/game/{sessionId}` - Get game session details
- `DELETE /api/game/{sessionId}` - End game session

### Player Operations
- `POST /api/game/{sessionId}/players` - Initialize player names
- `POST /api/game/{sessionId}/choice` - Make player choice
- `POST /api/game/{sessionId}/play` - Execute round and get results

### Game Flow
- `POST /api/game/{sessionId}/new-round` - Start new round
- `POST /api/game/{sessionId}/reset` - Reset entire game
- `GET /api/game/stats` - Get active sessions count

## 📁 Project Structure

```
src/
├── main/
│   ├── java/com/game/rockpaperscissors/
│   │   ├── controller/          # REST controllers
│   │   ├── model/              # Game entities
│   │   ├── service/            # Business logic
│   │   └── RockPaperScissorsApplication.java
│   └── resources/
│       ├── static/
│       │   ├── css/game.css    # Styling and animations
│       │   └── js/game.js      # Frontend logic
│       ├── templates/index.html # Main HTML template
│       └── application.properties
└── test/                       # Unit tests
```

## 🎨 Technical Highlights

### Spring Boot Features
- **Auto-configuration** - Minimal setup required
- **Embedded Tomcat** - No external server needed
- **Thymeleaf templating** - Server-side rendering
- **DevTools** - Hot reload during development

### Frontend Features
- **CSS Grid/Flexbox** - Modern layout techniques
- **CSS Animations** - Smooth transitions and effects
- **Web Audio API** - Custom sound generation
- **Fetch API** - Modern HTTP client
- **ES6+ JavaScript** - Modern language features

### Game Logic
- **Enum-based choices** - Type-safe game options
- **Session management** - Concurrent game support
- **State machine** - Clear game flow control
- **Score persistence** - Maintained across rounds

## 🧪 Testing

Run the test suite:
```bash
./mvnw test
```

Tests include:
- **Unit tests** for game logic
- **Service layer tests** for business logic
- **Choice validation tests** for game rules

## 🎯 Game Rules

- **Rock** beats **Scissors** 🪨 > ✂️
- **Scissors** beats **Paper** ✂️ > 📄  
- **Paper** beats **Rock** 📄 > 🪨
- **Same choices** result in a tie

## 🎊 Victory Features

### Disco Lights
- 8 animated lights with different colors
- Smooth scaling, rotation, and opacity changes
- Timed delays for dynamic movement

### Sound Effects
- 6 sequential clapping sounds
- Generated using Web Audio API
- Filtered for realistic audio quality

### Middle Finger Animation
- 4x sized emoji (4em)
- Flies from winner to loser position
- Smooth trajectory with rotation effects

## 🔧 Configuration

### Server Settings
- **Port**: 8080 (configurable in `application.properties`)
- **Context Path**: `/` (root)
- **Static Resources**: Served from `/static/`

### Development Settings
- **Hot Reload**: Enabled with DevTools
- **Template Caching**: Disabled for development
- **Logging**: DEBUG level for game package

## 🚀 Deployment

### Local Development
```bash
./mvnw spring-boot:run
```

### Production Build
```bash
./mvnw clean package
java -jar target/rock-paper-scissors-1.0.0.jar
```

### Docker (Optional)
```dockerfile
FROM openjdk:17-jdk-slim
COPY target/rock-paper-scissors-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

## 🎮 Enjoy the Game!

Experience the most entertaining Rock Paper Scissors game with:
- ✅ Professional Spring Boot backend
- ✅ Smooth animations and effects  
- ✅ Victory celebrations with disco lights
- ✅ Realistic clapping sounds
- ✅ Hilarious middle finger animations
- ✅ Personalized player experience
- ✅ Mobile-responsive design

Have fun playing! 🎉
>>>>>>> 023cd4a (Rock paper scissord game using amazon q)
