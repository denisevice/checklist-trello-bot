# Checklist Bot documentation

## Introduction

The **Checklist Bot** Power-Up adds new features to a Trello board:
- **Checklist templating**
    - assign a checklist *template* to each list
    - automatically add the *template*'s checklists to any card added or moved to a list
- **Automated actions on check** when an item is checked in a checklist such as:
    - Move the card to another list in the board
    - Move the card to another board
    - Assign a label
    - Archive the card

At OCTO Technology we have developed this power-up for internal use (HR hiring) and for our customers (Factory workshops management, Administrative processes) and share it with you!

If you use Trello for process management, check it out:

![Screenshot1](https://cdn.glitch.com/9aebe639-1af4-4ed8-9467-a054ae8cdf2b%2FNScreen1.jpg?1501683458765)

*Screenshot 1: Checklist Bot setup : choose the location of the templates - in this case, the first list called "Template" stores the checklists templates*

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
  

![Screenshot2](https://cdn.glitch.com/9aebe639-1af4-4ed8-9467-a054ae8cdf2b%2FCheckbot%201step.jpg?1501762939721)

*Screenshot 2: When a card is created in the Inbox list, the bot automatically adds the Inbox checklist. Actions such as move, archive card or add label are available*

## Why do call it a bot?
Automatic actions are performed by the Trello user who authorized the **Checklist bot** power-up.
Once properly configured, the "bot" acts in the background until desactived.

The bot can be started by any member of the board.
It then acts on behalf of this user and inherits his access rights. Any unauthorized access to a board or an action will simply be discarded.

## How do templates work?
A checklist template is simply a card bearing the name of a list and containing one or more checklists.
Card templates are usually stored in a list containing all the templates associated a board.
Once you've told **Checklist Bot** where to look for the template you are all set

## How can you setup bot actions?
Checklist Bot detects actions after the keyword "->" in text associated to checklist items.
The following actions can be detected and launched:

Action | Description | Syntax 
------------ | ------------- | ----------------
list| Move the card to a list | -> **list**(*listName, position*)
  |  |   | **listName**: *name of the target list*
  |  |   | **position** (optional): *location in the list the card will move. Possible values are **top** and **bottom** (default)*
board| Move the card to a list in another board | -> **board**(*boardName, listName, position*)
  |  |   | **boardName**: *name of the target board*
  |  |   | **listName**: *name of the target list*
  |  |   | **position** (optional): *location in the list the card will move. Possible values are **top** and **bottom** (default)*
archive| Archive a card. This action is reversible | -> **archive**()
label| Add a label to the card. This action is reversible | -> **label**(*color, labelName*)
  |  |   | **color**: *one of Trello standard colors (blue, green, orange, purple, red, yellow, sky, lime, pink, black)* 
  |  |   | **labelName**: *a text to display in the label* 

## Demo board
If you want to try it, please make a copy of [Hiring Process](https://trello.com/b/36AnQeAb/hiring-process-checklist-bot-power-up-demo) board.

Then proceed with the following steps:
1. Install the Checklist Bot power-up
1. Add Checklist Bot to the board
1. Authorize the power-up
1. Configure the template locations

## Install the Checklist Bot power-up
Checklist Bot will soon be available directly from Trello.
Meanwhile you can add the power-up for your team using the [administration site](https://trello.com/power-ups/admin)

Checklist Bot is served on Glitch and you can use the following **Manifest URL** the following value: https://checklist-bot.glitch.me/manifest.json

You are also free to remix the [Glitch project](https://glitch.com/edit/#!/checklist-bot) and use your own manifest or serve the power-up from your own NodeJs server.

See Trello documentation on [Power-ups](https://trello.readme.io/v1.0/reference#power-ups-intro) and their [administration](https://trello.com/power-ups/admin)

## Add Checklist Bot to the board
Just select it in Trello power-up menu

## Authorize the power-up
Connect on the Trello account you want to start the bot with and press the "tool" icon associated to the Checklist power-up.
Authorize the power-up. Watch out, the popup screen might be blocked by your brower and you need to authorize it.

## Configure the location of the checklist templates
Select "Edit Power-Up settings" and choose the location of the template board and the template list.
By default, the template board can be located in the current board.
By default, the template list should have mp


## About
Powered by OCTO Technology, 2017

Design & code by Louis Jeckel, Christophe Durand and Aurélien Rambaux

Code is open-source and available on [Github](https://github.com/louisjeck/checklist-trello-bot) and [Glitch](https://glitch.com/edit/#!/checklist-bot)

