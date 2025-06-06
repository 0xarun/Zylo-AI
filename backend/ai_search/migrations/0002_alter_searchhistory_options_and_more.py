# Generated by Django 5.1.6 on 2025-03-16 16:57

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ai_search', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='searchhistory',
            options={'ordering': ['-created_at']},
        ),
        migrations.RenameField(
            model_name='searchhistory',
            old_name='timestamp',
            new_name='created_at',
        ),
        migrations.AddIndex(
            model_name='searchhistory',
            index=models.Index(fields=['user', '-created_at'], name='ai_search_s_user_id_3901a1_idx'),
        ),
    ]
