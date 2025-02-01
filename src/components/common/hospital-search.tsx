'use client'

import { useState, useEffect, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import Cookies from 'js-cookie'
import debounce from 'lodash/debounce'
import { toast } from 'sonner'

interface Hospital {
  id: number
  name: string
  city_id: number
}

interface HospitalSearchProps {
  onSelect: (hospital: Hospital) => void
  value?: string
}

export function HospitalSearch({ onSelect, value }: HospitalSearchProps) {
  const [inputValue, setInputValue] = useState('')
  const [hospitals, setHospitals] = useState<Hospital[]>([])
  const [recentHospitals, setRecentHospitals] = useState<Hospital[]>([])
  const [showResults, setShowResults] = useState(false)

  // 쿠키에서 최근 선택한 병원들 로드
  useEffect(() => {
    const recentHospitalsCookie = Cookies.get('recentHospitals')
    if (recentHospitalsCookie) {
      try {
        setRecentHospitals(JSON.parse(recentHospitalsCookie))
      } catch (e) {
        console.error('Failed to parse recent hospitals:', e)
        setRecentHospitals([])
      }
    }
  }, [])

  // 디바운스된 검색 함수
  const debouncedSearch = useCallback(
    debounce(async (term: string) => {
      console.log('Debounced search called with term:', term)
      
      if (!term.trim()) {
        setHospitals([])
        return
      }

      try {
        console.log('Sending search request for:', term)
        const { data, error } = await supabase
          .from('hospitals')
          .select('id, name, city_id')
          .ilike('name', `%${term}%`)
          .limit(10)

        console.log('Hospital search results:', data)

        if (error) {
          console.error('Search error:', error)
          throw error
        }

        // 필터링 제거하고 모든 검색 결과 표시
        if (data) {
          setHospitals(data)
        }
      } catch (error) {
        console.error('Error searching hospitals:', error)
        setHospitals([])
      }
    }, 500),
    [recentHospitals]
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    console.log('Input changed:', value)
    setInputValue(value)
    setShowResults(true)
    debouncedSearch(value)
  }

  // 병원 선택 처리
  const handleSelect = (hospital: Hospital) => {
    console.log('Selected hospital with full data:', hospital)
    
    if (!hospital.city_id) {
      console.error('No city_id found for hospital:', hospital)
      toast.error('병원 정보가 올바르지 않습니다')
      return
    }

    onSelect(hospital)
    setInputValue(hospital.name)
    setShowResults(false)
    
    const updatedRecent = [
      hospital,
      ...recentHospitals.filter(h => h.id !== hospital.id)
    ].slice(0, 5)

    setRecentHospitals(updatedRecent)
    Cookies.set('recentHospitals', JSON.stringify(updatedRecent), { expires: 30 })
  }

  return (
    <div className="relative hospital-search-container">
      <Input
        placeholder="병원명을 입력하세요"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => setShowResults(true)}
      />
      {showResults && (
        <div className="absolute w-full mt-1 rounded-md border bg-white shadow-lg z-[100]">
          {recentHospitals.length > 0 && !inputValue && (
            <div className="p-2">
              <div className="text-sm font-medium text-gray-700 px-2 py-1">
                최근 선택한 병원
              </div>
              {recentHospitals.map((hospital) => (
                <div
                  key={hospital.id}
                  className="px-2 py-2 hover:bg-gray-100 cursor-pointer rounded-sm text-gray-900"
                  onClick={() => handleSelect(hospital)}
                >
                  {hospital.name}
                </div>
              ))}
            </div>
          )}
          {hospitals.length > 0 && (
            <div className="p-2">
              {hospitals.map((hospital) => (
                <div
                  key={hospital.id}
                  className="px-2 py-2 hover:bg-gray-100 cursor-pointer rounded-sm text-gray-900"
                  onClick={() => handleSelect(hospital)}
                >
                  {hospital.name}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
} 