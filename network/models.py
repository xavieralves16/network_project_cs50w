from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass


from django.conf import settings

class Post(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="posts"
    )
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    likes = models.ManyToManyField(
        settings.AUTH_USER_MODEL, related_name="liked_posts", blank=True
    )

    def __str__(self):
        return f"{self.user.username}: {self.content[:30]}"
    
    @property
    def like_count(self):
        return self.likes.count()
    

class Follow(models.Model):
    follower = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="following"
    )
    following = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="followers"
    )

    def __str__(self):
        return f"{self.follower.username} follows {self.following.username}"