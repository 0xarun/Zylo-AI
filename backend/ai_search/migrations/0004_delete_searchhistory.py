# Generated by Django 5.1.6 on 2025-03-16 17:33

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('ai_search', '0003_conversation_message_and_more'),
    ]

    operations = [
        migrations.DeleteModel(
            name='SearchHistory',
        ),
    ]
