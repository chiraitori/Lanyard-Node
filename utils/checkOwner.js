const ownerId = '685716988471148552'; // Replace with your Discord ID

function isOwner(userId) {
    return userId === ownerId;
}

module.exports = { isOwner };
