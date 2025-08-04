from django.contrib import admin
from .models import UserProfile, JournalEntry, FamilyMember, Doctor, Profile

admin.site.register(UserProfile)
admin.site.register(JournalEntry)
admin.site.register(FamilyMember)
admin.site.register(Doctor)
admin.site.register(Profile)
