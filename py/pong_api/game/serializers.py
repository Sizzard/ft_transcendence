from rest_framework import serializers

class PlayerInputSerializer(serializers.Serializer):
    input = serializers.ChoiceField(choices=['up', 'down', 'idle'])
