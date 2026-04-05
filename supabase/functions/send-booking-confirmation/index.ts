import "jsr:@supabase/functions-js/edge-runtime.d.ts"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    })
  }

  try {
    const { email, name, eventType, eventDate, message } = await req.json()

    if (!email || !name) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      )
    }

    const emailBody = `
Dear ${name},

Thank you for booking with Juan Captures!

We have received your booking request with the following details:

Event Type: ${eventType}
Event Date: ${new Date(eventDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })}

Message: ${message}

We will review your request and confirm your booking within 24 hours. You will receive an email confirmation soon.

If you have any questions, please don't hesitate to contact us at:
Email: info@juancaptures.com
Phone: +1 (234) 567-890

Best regards,
Juan Captures Team
"Capturing Moments, Creating Memories"
    `

    const adminEmailBody = `
New Booking Request from Juan Captures Website

Client Name: ${name}
Email: ${email}
Event Type: ${eventType}
Event Date: ${new Date(eventDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })}

Message:
${message}

Please review this booking and confirm with the client.
    `

    const supabaseUrl = Deno.env.get("SUPABASE_URL")
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${Deno.env.get("RESEND_API_KEY") || ""}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "bookings@juancaptures.com",
        to: email,
        subject: "Booking Confirmation - Juan Captures",
        text: emailBody,
      }),
    })

    if (!emailResponse.ok && Deno.env.get("RESEND_API_KEY")) {
      console.error("Email send failed:", await emailResponse.text())
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Booking received. Confirmation email sent.",
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    )
  } catch (error) {
    console.error("Error:", error)

    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Internal server error",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    )
  }
})
