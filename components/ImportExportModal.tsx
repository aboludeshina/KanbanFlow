import React, { useState, useRef } from 'react';
import { FaDownload, FaUpload, FaFileCsv, FaFileCode, FaTimes } from 'react-icons/fa';
import { BoardData } from '../types';

interface ImportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  boardData: BoardData;
  setBoardData: (data: BoardData) => void;
}

const ImportExportModal: React.FC<ImportExportModalProps> = ({
  isOpen,
  onClose,
  boardData,
  setBoardData
}) => {
  const [exportFormat, setExportFormat] = useState<'json' | 'csv'>('json');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    let content: string;
    let filename: string;
    let mimeType: string;

    if (exportFormat === 'json') {
      content = JSON.stringify(boardData, null, 2);
      filename = `kanban-board-${new Date().toISOString().split('T')[0]}.json`;
      mimeType = 'application/json';
    } else {
      // CSV Export
      let csvContent = 'ID,Title,Description,Priority,Tag,Due Date\n';

      // Get all cards from all columns
      Object.values(boardData.cards).forEach((card: any) => {
        const csvRow = [
          card.id,
          `"${card.title.replace(/"/g, '""')}"`,
          `"${card.description.replace(/"/g, '""')}"`,
          card.priority,
          card.tag,
          card.dueDate || ''
        ].join(',');
        csvContent += csvRow + '\n';
      });

      content = csvContent;
      filename = `kanban-board-${new Date().toISOString().split('T')[0]}.csv`;
      mimeType = 'text/csv';
    }

    // Create download link
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;

        if (file.name.endsWith('.json')) {
          const importedData = JSON.parse(content);
          // Basic validation
          if (importedData.columns && importedData.cards && importedData.columnOrder) {
            setBoardData(importedData);
            alert('Board imported successfully!');
          } else {
            alert('Invalid JSON format. Please select a valid Kanban board export file.');
          }
        } else if (file.name.endsWith('.csv')) {
          // CSV Import - create basic board structure
          const lines = content.split('\n');
          const headers = lines[0].split(',');

          const cards: BoardData['cards'] = {};
          const columnIds = ['backlog', 'todo', 'inProgress', 'done'];
          const columns: BoardData['columns'] = {};
          const columnOrder: string[] = [];

          // Create columns
          columnIds.forEach((id, index) => {
            columns[id] = {
              id,
              title: id.charAt(0).toUpperCase() + id.slice(1).replace(/([A-Z])/g, ' $1'),
              cardIds: []
            };
            columnOrder.push(id);
          });

          // Parse CSV rows
          for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            const values = line.split(',');
            if (values.length >= 6) {
              const card: BoardData['cards'][string] = {
                id: values[0],
                title: values[1].replace(/"/g, ''),
                description: values[2].replace(/"/g, ''),
                priority: values[3] as any,
                tag: values[4] as any,
                dueDate: values[5] || ''
              };

              cards[card.id] = card;
              // Add to first column for simplicity
              columns.backlog.cardIds.push(card.id);
            }
          }

          setBoardData({
            columns,
            cards,
            columnOrder
          });
          alert('Board imported successfully! Cards added to Backlog.');
        }
      } catch (error) {
        console.error('Import error:', error);
        alert('Error importing file. Please check the file format.');
      }
    };

    reader.readAsText(file);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
        <div className="flex justify-between items-center p-5 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
          <div className="flex items-center space-x-2.5 text-black dark:text-white">
            <span className="text-neutral-500"><FaUpload size={20} title="Upload Icon" /></span>
            <h2 className="text-xl font-bold">Import/Export Board</h2>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-black dark:hover:text-white transition-colors">
            <span><FaTimes /></span>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Export Section */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 mb-3 uppercase tracking-wide">
              Export Board
            </h3>

            <div className="flex items-center space-x-3 mb-3">
              <div
                onClick={() => setExportFormat('json')}
                className={`flex-1 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  exportFormat === 'json'
                    ? 'border-black dark:border-white bg-neutral-50 dark:bg-neutral-900'
                    : 'border-transparent bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800'
                }`}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <span className={exportFormat === 'json' ? 'text-black dark:text-white' : 'text-neutral-500'}><FaFileCode size={20} /></span>
                  <span className={`font-semibold ${exportFormat === 'json' ? 'text-black dark:text-white' : 'text-neutral-500'}`}>JSON</span>
                </div>
                <p className="text-xs text-neutral-500">
                  Full backup with all data preserved
                </p>
              </div>

              <div
                onClick={() => setExportFormat('csv')}
                className={`flex-1 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  exportFormat === 'csv'
                    ? 'border-black dark:border-white bg-neutral-50 dark:bg-neutral-900'
                    : 'border-transparent bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800'
                }`}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <span className={exportFormat === 'csv' ? 'text-black dark:text-white' : 'text-neutral-500'}><FaFileCsv size={20} /></span>
                  <span className={`font-semibold ${exportFormat === 'csv' ? 'text-black dark:text-white' : 'text-neutral-500'}`}>CSV</span>
                </div>
                <p className="text-xs text-neutral-500">
                  Spreadsheet compatible format
                </p>
              </div>
            </div>

            <button
              onClick={handleExport}
              className="w-full flex items-center justify-center px-4 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all font-medium"
            >
              <span className="mr-2"><FaDownload title="Download Icon" /></span>
              Export as {exportFormat.toUpperCase()}
            </button>
          </div>

          <div className="border-t border-neutral-200 dark:border-neutral-800 pt-6">
            {/* Import Section */}
            <h3 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 mb-3 uppercase tracking-wide">
              Import Board
            </h3>

            <div className="space-y-3">
              <p className="text-sm text-neutral-600 dark:text-neutral-300">
                Import a previously exported board file (JSON or CSV format).
              </p>

              <input
                ref={fileInputRef}
                type="file"
                accept=".json,.csv"
                onChange={handleImport}
                className="hidden"
                id="import-file"
              />
              <div className="flex flex-col items-center p-6 border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl bg-neutral-50 dark:bg-neutral-900/50 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <span className="text-neutral-400 mb-2"><FaUpload size={24} /></span>
                <span className="text-sm font-medium text-neutral-600 dark:text-neutral-300">
                  Click to upload JSON file
                </span>
                <span className="text-xs text-neutral-400 mt-1">
                  or drag and drop
                </span>
              </div>

              <p className="text-xs text-neutral-400">
                Supported formats: .json, .csv
              </p>
            </div>
          </div>
        </div>

        <div className="p-5 border-t border-neutral-200 dark:border-neutral-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-neutral-700 bg-white border border-neutral-200 rounded-xl hover:bg-neutral-50 hover:text-black dark:bg-black dark:text-neutral-300 dark:border-neutral-800 dark:hover:bg-neutral-900 dark:hover:text-white transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportExportModal;