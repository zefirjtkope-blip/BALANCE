import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://yaxgejrvzruotrnlwumb.supabase.co'
const supabaseAnonKey = 'sb_publishable_VhQJZE5JdRfA1TOND2SrCg_o7cA37tt'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)