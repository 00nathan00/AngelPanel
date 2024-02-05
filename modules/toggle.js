module.exports.details = {
    name: "toggle",
    version: "1.0.0",
    author: "emilca & david_goodenough",
    level: 1,
    admin: false,
    sadmin: false,
    comments: ""
}

module.exports.codegen = () => `
-- \\\\\\\\\\\\ Toggle //////////// 
local t = emodules.new()

t.name = "Toggle"
t.desc = "Permet de Parler/s'accroupir/courir automatiquement"


 autowalk = autowalk or false 
 autoduck = autoduck or false 
 autotalk = autotalk or false
local WalkCooldown = 0
local DuckCooldown = 0
local TalkCooldown = 0

function t:onStart()

    hook.Add( "PlayerButtonUp", "AngelPanel:Toggle:Walk", function( ply, key )
        if not IsFirstTimePredicted() then return end
        if key == input.GetKeyCode(input.LookupBinding( "+forward" ) or "e") and emodules:getmconfig("Toggle","sprint") and not LocalPlayer():InVehicle() then
            if autowalk then 
                RunConsoleCommand("-forward")
                RunConsoleCommand("-speed")
                autowalk = false 
                return	
            end
            if CurTime() -WalkCooldown < 0.5 then 
                autowalk  = true
                RunConsoleCommand("+forward")
                RunConsoleCommand("+speed")
            else
                WalkCooldown = CurTime()
            end
        end
    
        if key == input.GetKeyCode(input.LookupBinding( "+duck" ) or "CTRL" ) and emodules:getmconfig("Toggle","duck") and not LocalPlayer():InVehicle() then
            if autoduck then 
                RunConsoleCommand("-duck")
                autoduck = false 
                return	
            end
            if CurTime() -DuckCooldown < 0.5 then 
                autoduck  = true
                RunConsoleCommand("+duck")
            else
                DuckCooldown = CurTime()
            end
        end
    
        if key == input.GetKeyCode(input.LookupBinding( "+voicerecord" ) or "x") and emodules:getmconfig("Toggle","talk") and not LocalPlayer():InVehicle() then
            if autotalk then 
                permissions.EnableVoiceChat( false )
                autotalk = false 
                return	
            end
            if CurTime() -TalkCooldown < 0.7 then 
                autotalk  = true
                permissions.EnableVoiceChat( true)
            else
                TalkCooldown = CurTime()
            end
        end
       
    
     end )

end
function t:onStop()
    hook.Remove("PlayerButtonUp", "AngelPanel:Toggle:Walk")
    // stop talk/walk/duck if they are activate
    if autowalk then 
        RunConsoleCommand("-forward")
    end
    if autoduck then 
        RunConsoleCommand("-duck")
    end
    if autotalk then 
        permissions.EnableVoiceChat( false )
    end
end

t:addConfig("sprint",{
    name = "Course automatique",
    desc = "Appuyez deux fois sur votre touche pour avancer pour avancer automatiquement",
    vgui = "ToggleBtn",
    defvalue = true
})
t:addConfig("duck",{
    name = "Accroupissement automatique",
    desc = "Appuyez deux fois sur votre touche pour vous accroupir pour s'accroupir automatiquement",
    vgui = "ToggleBtn",
    defvalue = true
})
t:addConfig("talk",{
    name = "Voix automatique",
    desc = "Appuyez deux fois sur votre touche pour parler pour parler automatiquement",
    vgui = "ToggleBtn",
    defvalue = true
})



t:End()

`