# 🐱 Find Whiskers - Reaction Game

**Find Whiskers** is a fun and fast-paced **reaction game** built with JavaScript, HTML, and CSS. The objective is simple:  
**React as fast as you can when the cat image appears among a stream of dog images!**

Your reaction time is measured and recorded, and you'll instantly know whether you caught the cat or missed it. It's a perfect blend of entertainment and a practical demonstration of using multiple APIs in a real-world project.

---

## 🎯 Game Idea

The goal of this game is to **spot and click** when you see a **cat image** pop up among several **dog images** that change rapidly.

- The faster you click when the cat appears, the **better your score** (lower time = better reaction).
- If you click **before the cat appears**, you lose the game.

The game is built to demonstrate how **multiple APIs** can be used together to create an interactive and useful web application.

---

## 🧠 What This Project Demonstrates

This project showcases:

- Working with **multiple APIs** in one application
- Using **asynchronous JavaScript** (Promises and `async/await`)
- Managing **game sessions** and scores
- Dynamic **DOM manipulation**
- Image **preloading and fast rendering**
- Building a fun **user interface**

---

## 🧩 APIs Used

1. **The Dog API**
   - 📸 Endpoint: `https://api.thedogapi.com/v1/images/search`
   - Used to fetch random images of dogs.

2. **The Cat API**
   - 📸 Endpoint: `https://api.thecatapi.com/v1/images/search`
   - Used to fetch a single cat image, which is hidden among dog images.

3. **Reqres API (Mock API)**
   - 🧾 Endpoints:
     - `POST /api/users` – to start a game session with user data
     - `PUT /api/users/:id` – to update the game score
     - `GET /api/users/:id` – to retrieve current score (optional)
     - `DELETE /api/users/:id` – to end the game session
   - Used to simulate user sessions and score management.

---

## 🔧 How It Works

1. The player enters their name and starts the game.
2. 50 dog images and 1 cat image are fetched using the APIs.
3. All images are shuffled and preloaded.
4. Images are displayed rapidly one after another (starting slow and getting faster).
5. The player must **click the button** when they see the cat image.
6. If they clicked **at the right time**, their reaction time is shown as the score.
7. If they clicked **too early**, they lose the round.
8. A game session is created and deleted using the mock API to simulate backend functionality.

---

## 🛠️ Technologies Used

- **JavaScript** (ES6+)
- **HTML5**
- **CSS3**
- **Fetch API** for network requests
- **The Dog API & The Cat API** for media content
- **Reqres API** for user session and mock backend

---

## 🎮 Screenshots

![Image](https://github.com/user-attachments/assets/d1ca4362-5062-4161-8eec-3abe4aefeb07)
