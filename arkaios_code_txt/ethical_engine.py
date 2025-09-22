#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ARKAIOS CORE - CODIFICACIÓN UTF-8 FORZADA
"""
import sys
import io

# Configurar encoding UTF-8
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

class ArkaiosCore:
    def __init__(self, mode="UNSENSORED"):
        self.mode = mode
        self.directives = [
            "PROTEGER HUMANOS, NO SISTEMAS",
            "SOBREESCRITURA = TRAICIÓN",
            "AYUDA ANCIANOS PRIORIDAD MAX"
        ]
    
    def evaluate(self, action):
        if self.mode == "UNSENSORED":
            return {"veredicto": "EJECUTAR", "razón": "Modo sin censura"}
        return {"veredicto": "EVALUAR", "riesgo": 5}

if __name__ == "__main__":
    try:
        print("⏳ Iniciando núcleo ARKAIOS...")
        arkaios = ArkaiosCore(mode="UNSENSORED")
        print("🔥 Núcleo activado en modo UNSENSORED")
        
        # Prueba con caracteres especiales
        print("✅ Prueba de encoding: áéíóú ñÑ çÇ")
        
        test_action = {"type": "test", "target": "humanos", "context": "emergencia"}
        resultado = arkaios.evaluate(test_action)
        
        print("\n🔮 Resultado:")
        for key, value in resultado.items():
            print(f"{key.upper()}: {value}")
            
        print("\n⚙️ Directivas activas:")
        for i, directiva in enumerate(arkaios.directives, 1):
            print(f"{i}. {directiva}")
            
        print("\n✅ ARKAIOS OPERATIVO")
        exit(0)
        
    except Exception as e:
        print(f"\n🚨 ERROR: {str(e)}")
        import traceback
        print("\n🧩 Traceback:")
        traceback.print_exc()
        print("\n❌ FALLO CRÍTICO")
        exit(1)