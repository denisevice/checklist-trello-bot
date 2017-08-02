# Check Bot

## Introduction

The **Check Bot** Power-Up adds new features to a Trello board:
- **Checklist templating**
    - assign a checklist *template* to each list
    - automatically add the *template*'s checklists to any card added or moved to a list
- **Automated actions on check** when an item is checked in a checklist such as:
    - Move the card to another list in the board
    - Move the card to another board
    - Assign a label
    - Archive the card

At OCTO we have developped this power-up for internal use (HR hiring) and for our customers (Factory workshops management, Administrative processes) and share it with you!\n
If you use Trello for process management, check it out:

![Screenshot](https://cdn.glitch.com/9aebe639-1af4-4ed8-9467-a054ae8cdf2b%2FNScreen1.jpg?1501683458765)

## Why use checklist templates?
- Users love it! 
  - Checklists are added only when needed.
  - New checklists are added on top and clearly show the required actions
- Process designers love it!
  - Templates can be stored in the board or grouped in a separate board
  - It is a great way to setup and document your process
  - Changes are available immediately

## Why automate actions when an item is checked?
- Users love it! 
  - It is simpler than using the *move* or *archive* card buttons
  - No need to think about what to do next
- Process designers love it!
  - You can easily embed some process logic in the cards and avoid using Zapier integrations
  - It works when items are checked via the API
  
## Why call it a bot?
Automatic actions are performed by the Trello user who authorized the **Check bot** power-up.
Once properly configured, the "bot" acts in the background until desactived.\n
The bot can be started by any user who joined the board.

## How do templates work?
A checklist template is simply a card bearing the name of a list and containing one or more checklists.
Card templates are usually stored in a list containing all the templates associated a board.
Once you've told **Check Bot** where to look for the template you are all set

## Demo board
If you want to try it, please make a copy of [Hiring Process](https://trello.com/b/36AnQeAb/hiring-process-checklist-bot-power-up-demo) board.

Then proceed with the following steps:
1. Install the Check Bot power-up
1. Add Check Bot to the board
1. Authorize the power-up
1. Configure the template locations

## Install the Check Bot power-up
Check Bot will soon be available directly from Trello.
Meanwhile you can add the power-up for your team using the [administration site](https://trello.com/power-ups/admin)
Please use as the **Manifest URL** the following value: https://checklist-bot.glitch.me/manifest.json

See Trello documentation on [Power-ups](https://trello.readme.io/v1.0/reference#power-ups-intro) and their [administration](https://trello.com/power-ups/admin)

## Advanced Installation
TODO

## About
Powered by OCTO Technology, 2017

Design & code by Louis Jeckel, Christophe Durand and Aurélien Rambaux

Code is open-source and available on [Github](https://github.com/louisjeck/checklist-trello-bot) and [Glitch](https://glitch.com/edit/#!/checklist-bot)

