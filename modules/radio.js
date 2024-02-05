module.exports.details = {
    name: "radio",
    version: "1.0.0",
    author: "emilca & david_goodenough",
    level: 1,
    admin: false,
    sadmin: false,
    comments: ""
}

module.exports.codegen = () => `

local oldweapons = nil
local nwRadioState = SimpleRP.config.network.nwRadioState
local t = emodules.new()

t.name = "Radio"
t.desc = "Permet de parler sur la radio de police en appuyant sur une touche\\n(si vous lachez la touche en vous accroupissant vous ne reprenez pas votre ancienne arme)"

function t:onStart()
    hook.Add( "PlayerButtonDown", "emodules:radio:talkinradio", function( ply, button )
        if not IsFirstTimePredicted() then return end
        if button ~= emodules:getmconfig("Radio","touche")  then return end

        local weapon = LocalPlayer():GetWeapon("weapon_radio")
        if not IsValid(weapon) then
            return
        end

        if not LocalPlayer():InVehicle() then 
            oldweapons = LocalPlayer():GetActiveWeapon()
            input.SelectWeapon(weapon)
            if weapon:GetState() == 0 then
                net.Start(SimpleRP.config.network.nwRadioState)
                net.WriteUInt(1, 2)
                net.SendToServer()
            end
    
            net.Start(SimpleRP.config.network.nwRadioState)
            if weapon:GetState() == 1 then
                net.WriteUInt(2, 2) 
            else -- 2
                net.WriteUInt(1, 2) -- max: 3
            end
            net.SendToServer()
    
            permissions.EnableVoiceChat( true )
            SimpleRP.addNotification("Vous parlez dans la radio")
            return
        end

        if weapon:GetState() == 0 then
            net.Start(SimpleRP.config.network.nwRadioState)
            net.WriteUInt(1, 2)
            net.SendToServer()
        end

        net.Start(SimpleRP.config.network.nwRadioState)
        if weapon:GetState() == 1 then
            net.WriteUInt(2, 2) 
        else -- 2
            net.WriteUInt(1, 2) -- max: 3
        end
        net.SendToServer()

        permissions.EnableVoiceChat( true )
        SimpleRP.addNotification("Vous parlez dans la radio")
    end)
    hook.Add( "PlayerButtonUp", "emodules:radio:stoptalkinradio", function( ply, button )
        if not IsFirstTimePredicted() then return end
        if   button ~= emodules:getmconfig("Radio","touche")  then return end

        local weapon = LocalPlayer():GetWeapon("weapon_radio")
        if not IsValid(weapon) then
            return
        end

        if not LocalPlayer():InVehicle() then 
        
            if not LocalPlayer():KeyDown( IN_DUCK ) then  
                if oldweapons  then
                    input.SelectWeapon(oldweapons)
                end
            end
            permissions.EnableVoiceChat( false )
            SimpleRP.addNotification("Vous ne parlez plus dans la radio")
            net.Start(SimpleRP.config.network.nwRadioState)
            if weapon:GetState() == 1 then
                net.WriteUInt(2, 2) 
            else -- 2
                net.WriteUInt(1, 2) -- max: 3
            end
            net.SendToServer()
            return
        end
        permissions.EnableVoiceChat( false )
        SimpleRP.addNotification("Vous ne parlez plus dans la radio")
        net.Start(SimpleRP.config.network.nwRadioState)
        if weapon:GetState() == 1 then
            net.WriteUInt(2, 2) 
        else -- 2
            net.WriteUInt(1, 2) -- max: 3
        end
        net.SendToServer()
    end)
end
function t:onStop()
    hook.Remove( "PlayerButtonDown", "emodules:radio:talkinradio")
    hook.Remove( "PlayerButtonUp", "emodules:radio:stoptalkinradio")
end

t:addConfig("touche",{
    name = "Touche",
    desc = "Touche pour parler dans la radio",
    vgui = "DBinder",
    defvalue = KEY_I
})

t:End()
`