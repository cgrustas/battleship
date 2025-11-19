# Battleship

An implementation of the classic Battleship game, built as part of [The Odin Project](https://www.theodinproject.com/) curriculum.

## Overview

This project implements a browser-based version of Battleship where players battle against a computer opponent. Before the game begins, the user can shuffle their ship positions by clicking the 'randomize' button. For attacks, users can click on a grid cell in the enemy game board. There is visual feedback for hits, misses, and the ship locations for the enemy's board are obscured. Once a player's ships have all been sunk, a modal appears with the option to play again.

Each board contains the Milton Bradley fleet composition:

- Carrier (5 cells)
- Battleship (4 cells)
- Cruiser (3 cells)
- Submarine (3 cells)
- Destroyer (2 cells)

## Skills Demonstrated

### Functional Programming

- **Pure functions** as atomic units of composition. This was a vast departure from my previous projects.
- **Immutable data structures** using `Object.freeze()` to prevent mutation, but more so treating objects as immutable
- **Composition over inheritance** avoiding class hierarchies in favor of function composition (was especially helpful with the user/computer player functionality)

### Test-Driven Development (TDD)

- **Comprehensive test coverage** for all public APIs
- **Knowing what to test** tested incoming queries by making assertions about what they return
- **Knowing what not to test** private methods, outgoing queries, implementation details, exhaustive type checking, DOM manipulation, and imperative controller orchestration (covered by integration tests)
- **Black-box testing** focusing on behavior rather than implementation
- **Input validation** for edge cases and error conditions

### Software Architecture

- **Model-View-Controller (MVC) pattern**
- **Module organization** with one responsibility per module. I elected to not create objects for single instances (controller, view)
- **Minimal coupling** between components for better testability
- **Defensive programming** with thorough input validation

### Code Quality

- **Conventional commits** following semantic versioning standards
- **Clear error handling** with appropriate error types (TypeError, RangeError)
