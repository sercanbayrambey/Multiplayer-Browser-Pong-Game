
# Multiplayer Browser Pong Game 🏓

A real-time multiplayer Pong game that runs in web browsers, built with Node.js and Socket.IO. Players can connect from different devices and compete in classic Pong matches with smooth real-time synchronization.

<img src ="https://user-images.githubusercontent.com/45638332/67681061-a0889c80-f99d-11e9-9830-fd0cce7d9f95.png">

## 🚀 Features

- **Real-time multiplayer gameplay** - Up to 2 players can connect simultaneously
- **Cross-platform compatibility** - Works on any device with a modern web browser
- **Responsive controls** - Smooth paddle movement with W/S keys
- **Live game state synchronization** - Ball position, player positions, and scores are synchronized in real-time
- **Player identification** - Custom player names for each session
- **Game lobby system** - Automatic game start when 2 players join

## 🛠️ Technologies Used

### Backend
- **Node.js** - Server-side JavaScript runtime
- **Express.js** - Web application framework
- **Socket.IO** - Real-time bidirectional event-based communication
- **HTTP** - Server creation and handling

### Frontend
- **HTML5 Canvas** - Game rendering and graphics
- **JavaScript (ES6+)** - Client-side game logic and Socket.IO client
- **CSS** - Basic styling
- **Socket.IO Client** - Real-time communication with server

### Development & Deployment
- **Google App Engine** - Cloud deployment platform (app.yaml configuration)
- **npm** - Package management

## 🎮 How to Play

1. Enter your player name in the input field
2. Click "Giris yap" (Join Game) to connect
3. Wait for another player to join
4. Use **W** key to move paddle up
5. Use **S** key to move paddle down
6. Try to prevent the ball from reaching your side while hitting it toward your opponent

## 🔧 Installation & Setup

### Prerequisites
- Node.js (version 11.x or higher)
- npm (Node Package Manager)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/sercanbayrambey/Multiplayer-Browser-Pong-Game.git
   cd Multiplayer-Browser-Pong-Game
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:8080`

5. **Test multiplayer**
   Open multiple browser tabs or share the URL with friends on the same network

### Deployment

The project is configured for Google App Engine deployment:

```bash
gcloud app deploy
```

## 📁 Project Structure

```
├── app.js              # Express app configuration
├── app.yaml           # Google App Engine configuration
├── package.json       # Dependencies and scripts
├── public/            # Client-side files
│   ├── app.js         # Game logic and Socket.IO client
│   └── index.html     # Game interface
└── server/            # Server-side files
    ├── app.js         # Main server logic with game mechanics
    └── index.js       # Basic Socket.IO server setup
```

## 🔌 API/Socket Events

### Client to Server
- `PLAYER_NAME` - Send player name to server
- `PLAYER_DIRECTION_UPDATE` - Send paddle movement updates

### Server to Client
- `PLAYERS_UPDATE` - Receive updated player positions
- `BALL_UPDATE` - Receive updated ball position and velocity
- `GAME_STATUS_UPDATE` - Receive game status and messages

