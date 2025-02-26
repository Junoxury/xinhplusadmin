'use client'

import { UploadCloud, X } from 'lucide-react'
import * as React from 'react'
import { useDropzone } from 'react-dropzone'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

interface FileUploadProps extends React.HTMLAttributes<HTMLDivElement> {
  onFileChange: (file: File | null) => void
  onClear?: () => void
  value?: string
  accept?: string
}

export function FileUpload({
  onFileChange,
  onClear,
  value,
  accept = 'image/jpeg, image/png, image/gif, image/webp, image/svg+xml',
  className,
  ...props
}: FileUploadProps) {
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB in bytes

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/gif': [],
      'image/webp': [],
      'image/svg+xml': [],
    },
    maxFiles: 1,
    maxSize: MAX_SIZE,
    onDrop: (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        if (rejectedFiles[0].file.size > MAX_SIZE) {
          toast.error('파일 크기는 10MB를 초과할 수 없습니다')
        }
        return
      }
      if (acceptedFiles.length > 0) {
        onFileChange(acceptedFiles[0])
      }
    }
  })

  // 이미지 삭제 핸들러
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()  // 상위 클릭 이벤트 전파 방지
    onFileChange(null)  // 값을 null로 설정
    onClear?.()     // 추가 클리어 작업 실행
  }

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-lg p-4 cursor-pointer transition-colors',
          isDragActive ? 'border-primary bg-primary/10' : 'border-muted-foreground/25',
          className
        )}
        {...props}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center gap-2">
          <UploadCloud className="h-8 w-8 text-muted-foreground" />
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              {isDragActive ? '파일을 여기에 놓아주세요' : '클릭하거나 파일을 이곳에 끌어다 놓으세요'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              PNG, JPG, GIF, WEBP, SVG 최대 10MB (1개만 업로드 가능)
            </p>
          </div>
        </div>
      </div>

      {/* 업로드된 이미지 미리보기 */}
      {value && (
        <div className="flex items-center gap-2 p-2 border rounded-lg">
          <div className="relative w-20 h-20 rounded-md overflow-hidden">
            <img 
              src={value} 
              alt="Preview" 
              className="object-cover w-full h-full"
            />
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive ml-auto"
            onClick={handleDelete}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
} 