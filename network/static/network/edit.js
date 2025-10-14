document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".edit-btn").forEach(button => {
        button.onclick = () => {
            const card = button.closest(".card");
            const contentEl = card.querySelector(".post-content");
            const postId = card.getAttribute("data-post-id");  

            if (!contentEl) {
                console.error("No .post-content found in this card", card);
                return;
            }

            const oldContent = contentEl.innerText;

            // Replace content with textarea + buttons
            contentEl.innerHTML = `
                <label class="visually-hidden" for="edit-${postId}">Edit Post</label>
                <textarea id="edit-${postId}" class="form-control edit-textarea" placeholder="Edit your post...">${oldContent}</textarea>
                <button class="btn btn-primary btn-sm save-btn mt-1">Save</button>
                <button class="btn btn-secondary btn-sm cancel-btn mt-1">Cancel</button>
            `;

            // Handle cancel
            card.querySelector(".cancel-btn").onclick = () => {
                contentEl.innerHTML = oldContent;
            };

            // Handle save
            card.querySelector(".save-btn").onclick = () => {
                const newContent = card.querySelector(".edit-textarea").value;

                fetch(`/edit/${postId}`, {
                    method: "POST",
                    headers: {
                        "X-CSRFToken": document.querySelector("[name=csrfmiddlewaretoken]").value
                    },
                    body: new URLSearchParams({ content: newContent })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        contentEl.innerHTML = data.new_content;
                    } else {
                        alert(data.error);
                    }
                })
                .catch(err => console.error("Error saving post:", err));
            };
        };
    });
});
