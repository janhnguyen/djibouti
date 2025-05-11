export const createNotification = async ({ recipientID, senderID, postID, message }) => {
  const token = sessionStorage.getItem("token");

  const response = await fetch(`${process.env.REACT_APP_API_PATH}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      authorID: senderID,
      parentID: postID,
      type: "notification",
      content: "",
      attributes: {
        recipientID,
        senderID,
        postID,
        message,
      },
    }),
  });

  const data = await response.json();
  console.log("🔔 Notification created:", data);
  return data;
};

export const getNotifications = async () => {
  const currentUser = parseInt(sessionStorage.getItem("user"));
  const token = sessionStorage.getItem("token");

  try {
    const res = await fetch(`${process.env.REACT_APP_API_PATH}/posts?type=notification`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await res.json();
    const allNotifications = result[0];

    return allNotifications.filter(
      (n) =>
        n.attributes &&
        n.attributes.recipientID === currentUser &&
        n.attributes.message
    );
  } catch (err) {
    console.error("❌ Failed to fetch notifications:", err);
    return [];
  }
};

export const clearNotifications = async () => {
  const token = sessionStorage.getItem("token");
  const currentUser = parseInt(sessionStorage.getItem("user"));

  try {
    const res = await fetch(`${process.env.REACT_APP_API_PATH}/posts?type=notification`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await res.json();
    const allNotifications = result[0];

    const myNotifications = allNotifications.filter(
      (n) => n.attributes?.recipientID === currentUser
    );

    for (const notif of myNotifications) {
      await fetch(`${process.env.REACT_APP_API_PATH}/posts/${notif.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    console.log("🧹 All notifications cleared.");
  } catch (err) {
    console.error("❌ Failed to clear notifications:", err);
  }
};
