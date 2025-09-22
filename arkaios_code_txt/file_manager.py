import os
import zipfile
import json
import shutil
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Optional
import mimetypes

class FileManager:
    def __init__(self, base_dir: str = "data/downloads"):
        self.base_dir = Path(base_dir)
        self.base_dir.mkdir(parents=True, exist_ok=True)
        
    def create_zip(self, files: List[str], zip_name: str, compression: bool = True) -> str:
        """Crea un archivo ZIP con los archivos especificados"""
        zip_path = self.base_dir / f"{zip_name}.zip"
        
        compression_method = zipfile.ZIP_DEFLATED if compression else zipfile.ZIP_STORED
        
        with zipfile.ZipFile(zip_path, 'w', compression_method) as zipf:
            for file_path in files:
                if Path(file_path).exists():
                    zipf.write(file_path, os.path.basename(file_path))
        
        return str(zip_path)
    
    def create_zip_from_content(self, files_data: Dict[str, str], zip_name: str) -> str:
        """Crea ZIP a partir de contenido en memoria"""
        zip_path = self.base_dir / f"{zip_name}.zip"
        temp_dir = self.base_dir / "temp" / zip_name
        temp_dir.mkdir(parents=True, exist_ok=True)
        
        try:
            # Crear archivos temporales
            for filename, content in files_data.items():
                file_path = temp_dir / filename
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)
            
            # Crear ZIP
            shutil.make_archive(str(zip_path).replace('.zip', ''), 'zip', str(temp_dir))
            
            return str(zip_path)
        finally:
            # Limpiar directorio temporal
            shutil.rmtree(temp_dir, ignore_errors=True)
    
    def zip_directory(self, directory_path: str, zip_name: Optional[str] = None) -> str:
        """Comprime un directorio completo"""
        directory = Path(directory_path)
        if not directory.exists():
            raise ValueError(f"El directorio {directory_path} no existe")
        
        zip_name = zip_name or f"{directory.name}_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        zip_path = self.base_dir / f"{zip_name}.zip"
        
        shutil.make_archive(str(zip_path).replace('.zip', ''), 'zip', directory_path)
        
        return str(zip_path)
    
    def get_file_info(self, file_path: str) -> Dict:
        """Obtiene información detallada de un archivo"""
        path = Path(file_path)
        if not path.exists():
            raise FileNotFoundError(f"El archivo {file_path} no existe")
        
        return {
            'name': path.name,
            'size': path.stat().st_size,
            'modified': datetime.fromtimestamp(path.stat().st_mtime).isoformat(),
            'type': mimetypes.guess_type(file_path)[0] or 'application/octet-stream',
            'extension': path.suffix.lower(),
            'path': str(path)
        }
    
    def list_available_downloads(self) -> List[Dict]:
        """Lista todos los archivos disponibles para descarga"""
        downloads = []
        for file_path in self.base_dir.glob('*'):
            if file_path.is_file():
                downloads.append(self.get_file_info(str(file_path)))
        
        return downloads
    
    def cleanup_old_files(self, max_age_hours: int = 24):
        """Elimina archivos antiguos para ahorrar espacio"""
        now = datetime.now()
        for file_path in self.base_dir.glob('*'):
            if file_path.is_file():
                file_age = now - datetime.fromtimestamp(file_path.stat().st_mtime)
                if file_age.total_seconds() > max_age_hours * 3600:
                    file_path.unlink()