<script>
    import { onMount, onDestroy } from 'svelte';
    import pkg from 'matter-js';
    import confetti from 'canvas-confetti';
    const { Engine, Render, World, Bodies, Runner, Events, Vector } = pkg;
  
    let container;
    let engine;
    let render;
    let runner;
    let ball;
    let goal;
    let mazeWalls = [];
    let animationFrameId;
    let hasWon = false;
    let finalTime = 0;
    
    // Physics info
    let direction = { x: 0, y: 0 };
    let strength = 0;
  
    export let gameTime = 0;
  
    // Make dimensions responsive
    let width;
    let height;
    const aspectRatio = 1.6; // 800/500
    const ballRadius = 10;
    const goalRadius = 20;
  
    // Tilt values in range [-1,1]
    let tiltX = 0;
    let tiltY = 0;
    let targetTiltX = 0;
    let targetTiltY = 0;
    let isInputActive = false;
    let isHovering = false;
    let lastInputTime = 0;
    const RETURN_DELAY = 100; // ms to wait before starting return
    const RETURN_SPEED = 0.02; // Slower return to level
    const TILT_SCALE = 2; // Scale up the tilt effect (makes it start closer to center)

    function calculateTilt(value) {
      // Scale up the input to make tilt start closer to center
      return Math.max(-1, Math.min(1, value * TILT_SCALE));
    }

    function adjustTiltSensitivity(value) {
      // Apply non-linear scaling to make it more sensitive near center
      const sign = Math.sign(value);
      return sign * Math.pow(Math.abs(value) * 1.5, 0.8);
    }

    function updateTiltFromMouse(event) {
      if (!container) return;
      
      lastInputTime = Date.now();
      isInputActive = true;
      
      const rect = container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Calculate distance from center
      const dx = (event.clientX - centerX) / (rect.width / 2);
      const dy = (event.clientY - centerY) / (rect.height / 2);
      
      // Scale the tilt to start closer to center
      targetTiltX = calculateTilt(dx);
      targetTiltY = calculateTilt(dy);
    }

    function handlePointerMove(e) {
      const rect = container.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
  
      const x = (e.clientX - rect.left - centerX) / centerX;
      const y = (e.clientY - rect.top - centerY) / centerY;
  
      // Scale the tilt to start closer to center
      targetTiltX = calculateTilt(x);
      targetTiltY = calculateTilt(y);
      isInputActive = true;
    }

    function handleDeviceOrientation(event) {
      lastInputTime = Date.now();
      isInputActive = true;
      
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      
      let x, y;
      if (isIOS) {
        x = event.gamma / 90;
        y = event.beta / 90;
      } else {
        x = event.beta / 90;
        y = event.gamma / 90;
      }
      
      // Scale the tilt to start closer to center
      targetTiltX = calculateTilt(x);
      targetTiltY = calculateTilt(y);
    }
  
    $: direction = { 
      x: Number(tiltX).toFixed(2), 
      y: Number(tiltY).toFixed(2) 
    };
    $: strength = Math.min(100, Math.round(Math.sqrt(tiltX * tiltX + tiltY * tiltY) * 100));

    // Convert tilt to chevron count (0-3)
    $: chevrons = {
      up: Math.min(3, Math.max(0, Math.floor(-tiltY * 3))),
      down: Math.min(3, Math.max(0, Math.floor(tiltY * 3))),
      left: Math.min(3, Math.max(0, Math.floor(-tiltX * 3))),
      right: Math.min(3, Math.max(0, Math.floor(tiltX * 3)))
    };

    function getChevrons(count) {
      return count > 0 ? '›'.repeat(count) : '';
    }

    let showDirections = false;

    function handleKeyDown(event) {
      if (event.key.toLowerCase() === 'x' && isHovering) {
        showDirections = !showDirections;
      }
    }

    function handleMouseEnter() {
      isHovering = true;
    }

    function handleMouseLeave() {
      isHovering = false;
      isInputActive = false;
    }

    function handleMouseMove(event) {
      if (isHovering) {
        updateTiltFromMouse(event);
      }
    }

    function generateRandomMaze() {
      const wallOptions = {
        isStatic: true,
        restitution: 0.3,
        friction: 0.05,
        render: { fillStyle: '#666666' }
      };

      // Clear existing walls
      mazeWalls.forEach(wall => World.remove(engine.world, wall));
      mazeWalls = [];

      // Add border walls
      mazeWalls = [
        Bodies.rectangle(width/2, 0, width, 20, wallOptions),
        Bodies.rectangle(width/2, height, width, 20, wallOptions),
        Bodies.rectangle(0, height/2, 20, height, wallOptions),
        Bodies.rectangle(width, height/2, 20, height, wallOptions),
      ];

      // Add random internal walls
      const numWalls = 5 + Math.floor(Math.random() * 5); // 5-10 walls
      for (let i = 0; i < numWalls; i++) {
        const isVertical = Math.random() > 0.5;
        const wallLength = 50 + Math.random() * 150;
        const wallThickness = 10;
        
        const x = width * 0.2 + Math.random() * width * 0.6;
        const y = height * 0.2 + Math.random() * height * 0.6;
        
        mazeWalls.push(
          Bodies.rectangle(
            x, 
            y, 
            isVertical ? wallThickness : wallLength,
            isVertical ? wallLength : wallThickness,
            wallOptions
          )
        );
      }

      World.add(engine.world, mazeWalls);
    }

    function restartGame() {
      // Reset ball position
      World.remove(engine.world, ball);
      ball = Bodies.circle(width * 0.1, height * 0.1, ballRadius, {
        restitution: 0.5,
        friction: 0.03,
        frictionAir: 0.005,
        density: 0.002,
        render: { fillStyle: '#ff4444' }
      });
      World.add(engine.world, ball);

      // Generate new maze
      generateRandomMaze();

      // Reset game state
      hasWon = false;
      gameTime = 0;
      finalTime = 0;
    }

    function triggerWin() {
      hasWon = true;
      finalTime = gameTime;
      
      // Trigger confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    onMount(() => {
      engine = Engine.create({
        constraintIterations: 4,
        positionIterations: 8,
        velocityIterations: 8
      });
      
      engine.world.gravity.x = 0;
      engine.world.gravity.y = 0;
      
      runner = Runner.create();

      // Calculate dimensions based on container
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = width / aspectRatio;

      ball = Bodies.circle(width * 0.1, height * 0.1, ballRadius, {
        restitution: 0.5,
        friction: 0.03,
        frictionAir: 0.005,
        density: 0.002,
        render: { fillStyle: '#ff4444' }
      });

      ball.angularDamping = 0.2;
      ball.linearDamping = 0.05;

      World.add(engine.world, ball);

      goal = Bodies.circle(width * 0.8, height * 0.8, goalRadius, {
        isStatic: true,
        isSensor: true,
        render: { fillStyle: '#44ff44' }
      });

      World.add(engine.world, goal);

      // Generate initial maze
      generateRandomMaze();

      // Setup collision detection for win condition
      Events.on(engine, 'collisionStart', (event) => {
        event.pairs.forEach((pair) => {
          if ((pair.bodyA === ball && pair.bodyB === goal) ||
              (pair.bodyA === goal && pair.bodyB === ball)) {
            if (!hasWon) {
              triggerWin();
            }
          }
        });
      });

      render = Render.create({
        element: container,
        engine: engine,
        options: {
          width,
          height,
          wireframes: false,
          background: '#f0f0f0'
        }
      });
  
      Runner.run(runner, engine);
      Render.run(render);
  
      // Add mouse event listeners
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseleave', handleMouseLeave);
  
      // Add pointer move for desktop:
      container.addEventListener('pointermove', handlePointerMove);
  
      // Optional: use device orientation on mobile
      if ('DeviceOrientationEvent' in window) {
        // Request device orientation permission on iOS
        if (typeof DeviceOrientationEvent !== 'undefined' && 
            typeof DeviceOrientationEvent.requestPermission === 'function') {
          DeviceOrientationEvent.requestPermission()
            .then(response => {
              if (response === 'granted') {
                window.addEventListener('deviceorientation', handleDeviceOrientation);
              }
            })
            .catch(console.error);
        } else {
          window.addEventListener('deviceorientation', handleDeviceOrientation);
        }
      }
  
      window.addEventListener('keydown', handleKeyDown);
  
      update();
      
      return () => {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        if (runner) Runner.stop(runner);
        if (render) {
          Render.stop(render);
          render.canvas.remove();
        }
        World.clear(engine.world);
        Engine.clear(engine);
        engine = null;
        runner = null;
        render = null;
        window.removeEventListener('deviceorientation', handleDeviceOrientation);
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseleave', handleMouseLeave);
        window.removeEventListener('keydown', handleKeyDown);
      };
    });
  
    function update() {
      if (!engine) return;

      const now = Date.now();
      
      // Check if we should start returning to level
      if (isInputActive && now - lastInputTime > RETURN_DELAY) {
        isInputActive = false;
      }

      if (!isInputActive) {
        // Return to level (like placing on a table)
        targetTiltX = 0;
        targetTiltY = 0;
      }

      // Smoothly interpolate current tilt towards target
      const easing = isInputActive ? 0.2 : RETURN_SPEED;
      
      tiltX += (targetTiltX - tiltX) * easing;
      tiltY += (targetTiltY - tiltY) * easing;

      // Add small threshold to prevent tiny oscillations
      if (Math.abs(tiltX) < 0.01) tiltX = 0;
      if (Math.abs(tiltY) < 0.01) tiltY = 0;

      // Update gravity based on smoothed tilt
      engine.world.gravity.x = tiltX * 9.81 * 0.3;
      engine.world.gravity.y = tiltY * 9.81 * 0.3;

      // Update game time
      if (!hasWon) {
        gameTime += 1/60;
      }

      animationFrameId = requestAnimationFrame(update);
    }
  </script>
  
  <div class="maze-container" 
    bind:this={container}
    on:mouseenter={handleMouseEnter}
    on:mouseleave={handleMouseLeave}>
    {#if render && showDirections}
      <div class="direction-indicators" class:active={showDirections}>
        <div class="indicator up">{getChevrons(chevrons.up)}</div>
        <div class="indicator right">{getChevrons(chevrons.right)}</div>
        <div class="indicator down">{getChevrons(chevrons.down)}</div>
        <div class="indicator left">{getChevrons(chevrons.left)}</div>
      </div>
    {/if}
    
    {#if hasWon}
      <div class="win-screen">
        <h2>You Won!</h2>
        <p>Time: {finalTime.toFixed(1)}s</p>
        <button class="restart-btn" on:click={restartGame}>
          Play Again
        </button>
      </div>
    {/if}
  </div>
  
  <style>
  .maze-container {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    container-type: inline-size;
    cursor: crosshair;
  }

  .center-indicator {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.5);
    transform: translate(-50%, -50%);
    pointer-events: none;
    z-index: 5;
  }

  .center-indicator::after {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.3);
    transform: translate(-50%, -50%);
  }

  canvas {
    width: 100% !important;
    height: 100% !important;
  }

  .direction-indicators {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: grid;
    grid-template-areas:
      ". up ."
      "left . right"
      ". down .";
    gap: 1.5rem;
    font-family: monospace;
    font-size: 1.5rem;
    color: white;
    text-shadow: 0 0 4px rgba(0,0,0,0.5);
    z-index: 10;
    padding: 1rem;
    animation: fadeIn 0.2s ease-out;
  }

  .indicator {
    width: 3.5rem;
    height: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.4);
    border-radius: 3px;
    transition: background 0.2s;
  }

  .indicator:not(:empty) {
    background: rgba(0, 0, 0, 0.6);
  }

  .indicator.up {
    grid-area: up;
    transform: rotate(-90deg);
  }

  .indicator.right {
    grid-area: right;
  }

  .indicator.down {
    grid-area: down;
    transform: rotate(90deg);
  }

  .indicator.left {
    grid-area: left;
    transform: rotate(180deg);
  }

  .win-screen {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.8);
    padding: 2rem;
    border-radius: 1rem;
    text-align: center;
    color: white;
    z-index: 20;
  }

  .win-screen h2 {
    font-size: 2rem;
    margin: 0 0 1rem 0;
  }

  .win-screen p {
    font-size: 1.5rem;
    margin: 0 0 1.5rem 0;
  }

  .restart-btn {
    background: #44ff44;
    color: black;
    border: none;
    padding: 0.5rem 1.5rem;
    font-size: 1.2rem;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: background 0.2s;
  }

  .restart-btn:hover {
    background: #66ff66;
  }
  </style>