// netlify/functions/get-products.js
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://htpeqjdlzzygczrvhcll.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0cGVxamRsenp5Z2N6cnZoY2xsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5MzQ1NTMsImV4cCI6MjA3NDUxMDU1M30.dForPgwzfR5eusItwPYL-e3zj97Od6p4tWXc_CFlRtA'
);

exports.handler = async () => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('id, name, game, category, price, active')
      .eq('active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(data)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error interno' })
    };
  }
};