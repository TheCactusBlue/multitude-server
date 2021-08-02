# Multitude Server
Multitude is a structured messaging application inspired by Discord and Slack.

## Setting up

First, setup a .env file similar to:

```dotenv
SQL=postgresql://root@localhost:26257/multitude?sslmode=disable
SECRET=secret
```

then install packages and run by:

```bash
yarn
yarn start
```

**Note:** doesn't work on Windows due to MediaSoup dependency. (Works on WSL though)