import { ref, watch, Ref, onMounted } from 'vue'
import { useEventListener } from '../useEventListener'

const Serializers = {
  boolean: {
    read: (v: any, d: any) => v != null ? v === 'true' : d,
    write: (v: any) => String(v),
  },
  object: {
    read: (v: any, d: any) => v ? JSON.parse(v) : d,
    write: (v: any) => JSON.stringify(v),
  },
  number: {
    read: (v: any, d: any) => v != null ? Number.parseFloat(v) : d,
    write: (v: any) => String(v),
  },
  any: {
    read: (v: any, d: any) => v ?? d,
    write: (v: any) => String(v),
  },
  string: {
    read: (v: any, d: any) => v ?? d,
    write: (v: any) => String(v),
  },
}

export function useStorage (key: string, defaultValue: string, storage?: Storage): Ref<string>
export function useStorage (key: string, defaultValue: boolean, storage?: Storage): Ref<boolean>
export function useStorage (key: string, defaultValue: number, storage?: Storage): Ref<number>
export function useStorage<T extends object> (key: string, defaultValue: T, storage?: Storage): Ref<T>
export function useStorage<T extends null> (key: string, defaultValue: null, storage?: Storage): Ref<any>
export function useStorage<T extends (string | number | boolean | object | null)> (key: string, defaultValue: T, storage: Storage = localStorage) {
  const data = ref<T>(defaultValue)
  console.log(data.value)

  const type = defaultValue == null
    ? 'any'
    : typeof defaultValue === 'boolean'
      ? 'boolean'
      : typeof defaultValue === 'string'
        ? 'string'
        : typeof defaultValue === 'object'
          ? 'object'
          : Array.isArray(defaultValue)
            ? 'object'
            // @ts-ignore
            : !Number.isNaN(defaultValue)
              ? 'number'
              : 'any'

  function read () {
    try {
      let rawValue = storage.getItem(key)
      if (rawValue === undefined && defaultValue) {
        rawValue = Serializers[type].write(defaultValue)
        storage.setItem(key, rawValue)
      } else {
        data.value = Serializers[type].read(rawValue, defaultValue)
      }
    } catch (e) {
      console.warn(e)
    }
  }

  onMounted(() => {
    useEventListener('storage', read)
  })
  read()


  watch((() => data.value), (newValue) => {
      try {
        if (newValue == null) {
          storage.removeItem(key)
        } else {
          storage.setItem(key, Serializers[type].write(data.value))
        }
      } catch (e) {
        console.warn(e)
      }
    },
    {flush: 'post', deep: true},
  )

  return data
}
