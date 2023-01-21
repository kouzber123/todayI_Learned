import { createClient } from "@supabase/supabase-js";
const apikey = process.env.REACT_APP_API_KEY;

const supabaseUrl = "https://kziyagwskbvjroxalrmh.supabase.co";
// const supabaseKey = process.env.SUPABASE_KEY;
const supabaseKey = apikey;
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
