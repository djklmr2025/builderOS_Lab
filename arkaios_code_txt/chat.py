import requests

# Configura tus valores
AGENT_ID = "agent_01k0g541tef7188sfwekcjnt7k"
API_KEY = "Tsk-proj-mKnbtfd_8ZS1HjfJFiU1xgIdxu6CpzGJxtSFs7grEpgMe7_rSgO9RQUw8bIu1oSz3DVgPktbBjT3BlbkFJBEtfCWp6aLS4quWre8dL8gC8DnHAhhm616qNvuLYdtBt_GtACB4VjNp6G_atcXnZGS-M8APUcA"
CONVERSATION_ID = "consola-001"

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

print("🤖 ElevenLabs Chat (escribe 'salir' para terminar)\n")
while True:
    user_input = input("Tú: ")
    if user_input.lower() in ["salir", "exit", "quit"]:
        break

    payload = {
        "input": user_input,
        "conversation_id": CONVERSATION_ID
    }

    response = requests.post(
        f"https://api.elevenlabs.io/conversational-ai/agents/{AGENT_ID}/invoke",
        headers=headers,
        json=payload
    )

    if response.status_code == 200:
        data = response.json()
        print("Bot:", data.get("response", {}).get("text", "[Sin respuesta]"))
    else:
        print(f"[Error {response.status_code}]: {response.text}")
