import { useState, useRef } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { useUploadExcel } from '@/hooks/useExcelData';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

export default function FileUpload() {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const uploadMutation = useUploadExcel();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelection = (file: File) => {
    if (file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      toast({
        variant: "destructive",
        title: "Formato inválido",
        description: "Por favor, selecione apenas arquivos .xlsx"
      });
      return;
    }
    
    setSelectedFile(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        variant: "destructive",
        title: "Nenhum arquivo selecionado",
        description: "Por favor, selecione um arquivo .xlsx primeiro"
      });
      return;
    }

    try {
      await uploadMutation.mutateAsync(selectedFile);
      toast({
        title: "Arquivo processado com sucesso!",
        description: `${selectedFile.name} foi importado e processado.`
      });
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao processar arquivo",
        description: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
  };

  return (
    <section className="bg-card p-8 neo-border neo-shadow-lg hover-lift animate-slide-up">
      <div className="text-center">
        <h2 className="text-3xl font-black mb-6 text-foreground">
          UPLOAD DA PLANILHA
        </h2>
        
        <div 
          className={`border-4 border-dashed border-foreground p-12 transition-colors duration-200 cursor-pointer ${
            dragActive ? 'bg-accent' : 'bg-muted hover:bg-accent'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          data-testid="upload-area"
        >
          <Upload className="w-16 h-16 mx-auto mb-4 text-foreground" />
          <p className="text-2xl font-bold text-foreground mb-2">
            Arraste seu arquivo .xlsx aqui
          </p>
          <p className="text-lg font-semibold text-muted-foreground mb-4">
            ou clique para selecionar
          </p>
          
          {selectedFile && (
            <div className="flex items-center justify-center gap-2 mt-4 p-3 bg-accent text-accent-foreground neo-border">
              <FileText className="w-5 h-5" />
              <span className="font-bold">{selectedFile.name}</span>
            </div>
          )}
          
          <input 
            ref={fileInputRef}
            type="file" 
            accept=".xlsx" 
            className="hidden" 
            onChange={handleFileInputChange}
            data-testid="file-input"
          />
        </div>
        
        <Button 
          onClick={handleUpload}
          disabled={!selectedFile || uploadMutation.isPending}
          className="mt-6 bg-secondary text-secondary-foreground px-8 py-4 text-xl font-black neo-border neo-shadow hover-lift neo-button"
          data-testid="button-process-file"
        >
          {uploadMutation.isPending ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              PROCESSANDO...
            </div>
          ) : (
            'PROCESSAR ARQUIVO'
          )}
        </Button>
        
        {uploadMutation.isError && (
          <div className="mt-4 p-4 bg-destructive text-destructive-foreground neo-border flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span className="font-bold">
              Erro ao processar arquivo: {uploadMutation.error instanceof Error ? uploadMutation.error.message : 'Erro desconhecido'}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
