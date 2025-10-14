// Helper to get CSRF token from Django cookie
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
        const cookies = document.cookie.split(";");
        for (let cookie of cookies) {
            cookie = cookie.trim();
            if (cookie.startsWith(name + "=")) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
const csrftoken = getCookie("csrftoken");

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".like-btn").forEach(button => {
        button.onclick = () => {
            const section = button.closest(".like-section");
            const postId = section.getAttribute("data-post-id");
            const heart = section.querySelector(".heart");
            const likeCountEl = section.querySelector(".like-count");

            fetch(`/like/${postId}`, {
                method: "POST",
                headers: {
                    "X-CSRFToken": csrftoken
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // update count
                    likeCountEl.innerText = data.like_count;

                    // update heart color
                    if (data.liked) {
                        heart.style.color = "red";
                    } else {
                        heart.style.color = "grey";
                    }
                } else {
                    console.error("Error liking post:", data.error);
                }
            })
            .catch(err => console.error("Fetch error:", err));
        };
    });
});
