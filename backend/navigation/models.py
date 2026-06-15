from django.db import models

class Location(models.Model):
    id = models.CharField(max_length=50, primary_key=True)
    name = models.CharField(max_length=255)
    floor = models.IntegerField()
    building = models.IntegerField(null=True, blank=True)
    x = models.FloatField()
    y = models.FloatField()
    type = models.CharField(max_length=100)
    description = models.TextField(blank=True)