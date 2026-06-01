import { createClient } from '@supabase/supabase-js';


// Initialize database client
const supabaseUrl = 'https://goiyhwyvapgrspgqnrpr.databasepad.com';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImY5NTQ1OGM4LWMwZmQtNGM5NC05NzhjLTQ5ODIyY2NkMjJhNSJ9.eyJwcm9qZWN0SWQiOiJnb2l5aHd5dmFwZ3JzcGdxbnJwciIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzgwMjY4NzAzLCJleHAiOjIwOTU2Mjg3MDMsImlzcyI6ImZhbW91cy5kYXRhYmFzZXBhZCIsImF1ZCI6ImZhbW91cy5jbGllbnRzIn0.VZzLD52DqD7fPvHeoUUIUSKz6EDa3wJuPt0eAAY2UU0';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };