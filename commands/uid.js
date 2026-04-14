module.exports = {
  config: {
    name: 'uid',
    aliases: ['userid', 'getuid', 'id'],
    description: 'Get Instagram User ID from username',
    usage: 'uid [username]',
    cooldown: 5,
    role: 0,
    author: 'NeoKEX',
    category: 'utility'
  },

  async run({ api, event, args, bot, logger }) {
    try {
      if (args.length === 0) {
        return api.sendMessage(String(event.senderID), event.threadId);
      }

      const username = args[0].replace('@', '').trim();

      if (!username) {
        return api.sendMessage('❌ Please provide a valid username!\n\nUsage: uid <username>', event.threadId);
      }

      try {
        const userInfo = await bot.ig.getUserInfoByUsername(username);

        if (!userInfo) {
          return api.sendMessage(`❌ User @${username} not found!`, event.threadId);
        }

        const userId = userInfo.userID || userInfo.userId;
        return api.sendMessage(String(userId), event.threadId);

      } catch (searchError) {
        try {
          const searchResults = await bot.ig.searchUsers(username);

          if (!searchResults || searchResults.length === 0) {
            return api.sendMessage(`❌ User @${username} not found!`, event.threadId);
          }

          const userId = searchResults[0].userID || searchResults[0].userId;
          return api.sendMessage(String(userId), event.threadId);

        } catch (error2) {
          logger.error('Error in uid command (search fallback)', { error: error2.message });
          return api.sendMessage(`❌ Failed to find user @${username}: ${error2.message}`, event.threadId);
        }
      }

    } catch (error) {
      logger.error('Error in uid command', { error: error.message, stack: error.stack });
      return api.sendMessage(
        `❌ An error occurred while fetching user ID.\n\nError: ${error.message}`,
        event.threadId
      );
    }
  }
};
