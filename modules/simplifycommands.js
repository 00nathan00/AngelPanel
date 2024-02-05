module.exports.details = {
    name: "simplifycommands",
    version: "1.0.0",
    author: "emilca & david_goodenough",
    level: 1,
    admin: false,
    sadmin: false,
    comments: ""
}

module.exports.codegen = () => `
-- \\\\\\\\\\\\ SimplifyCommands //////////// 
local t = emodules.new()

t.name = "SimplifyCommands"
t.desc = "Simplifiez vos commandes en utilisant ces commandes :\\n(/ug, /pm, /dp, /dm, /c)"

function t:onStart()
    SimpleRP.addChatMessage(emodules.id,nil,"Avec le module SimplifyCommands, vous avez 5 nouvelles commandes :")
    SimpleRP.addChatMessage(1,nil,"/ug : Vous permet d'appeler les urgence, il faut indiquer seulement le lieux ")
    SimpleRP.addChatMessage(1,nil,"/pm : C'est pareille mais pour les pompiers")
    SimpleRP.addChatMessage(1,nil,"/dp : C'est pareille mais pour les depanneurs")
    SimpleRP.addChatMessage(1,nil,"/pm : Vous permet de poser de l'argent, vous avez seulement à indiquer la somme")
    SimpleRP.addChatMessage(1,nil,"/c : Vous permet de desactiver l'hud, Pour reavoir l'hud il faut apuyer sur echap")

    emodules:addCommand("Urgences",{
        commands = {"/ug"},
        color = Color(255,0,0),
        onUse = function(text)
            timer.Simple(0.8,function()  
            RunConsoleCommand("say", "/urgence Bonjour, besoin d'un médecin à/au " .. text .. ". Merci d'avance")
            end)
        end
    })
    emodules:addCommand("Pompiers",{
        commands = {"/pm"},
        color = Color(255,255,0),
        onUse = function(text)
            timer.Simple(0.8,function() 
                RunConsoleCommand("say", "/pompier Bonjour, un feu est en cours à/au " .. text .. ". Merci d'avance")
            end)
        end
    })
    emodules:addCommand("Depanneurs",{
        commands = {"/dp"},
        color = Color(96,96,96),
        onUse = function(text)
            timer.Simple(0.8,function() 
                RunConsoleCommand("say", "/depanneur Bonjour, besoin d'un dépanneur à/au " .. text .. ". Merci d'avance")
            end)
        end
    })
    emodules:addCommand("Dropmoney",{
        commands = {"/dm"},
        color = Color(139,0,0),
        onUse = function(text)
            timer.Simple(0.8,function() 
                RunConsoleCommand("say", "/dropmoney " .. text)
            end)
        end
    })
    emodules:addCommand("Camera",{
        commands = {"/c"},
        color = Color(139,0,0),
        onUse = function(text)
            if emodules_hidehud then return end
            if IsValid(SimpleRP.playerModelPanel) then
                SimpleRP.playerModelPanel:SetVisible(false)
            end
            if IsValid(menuPanel) then
                menuPanel:SetVisible(false)
            end
            emodules_hidehud = true
        
            hook.Add( "HUDShouldDraw", "emodules:camera", function( name )
                return false
            end)
            hook.Add( "PlayerButtonDown", "emodules:stopcams", function( ply, button )
                if button ~= KEY_ESCAPE then return end
                if not emodules_hidehud then return end 
                emodules_hidehud = false
                hook.Remove("HUDShouldDraw", "emodules:camera" )

                if IsValid(SimpleRP.playerModelPanel) then
                    SimpleRP.playerModelPanel:SetVisible(true)
                end
                if IsValid(menuPanel) then
                    menuPanel:SetVisible(true)
                end
            end)
                
        end
    })
end
function t:onStop()  
    emodules:removeCommand("Urgences")
    emodules:removeCommand("Pompiers")
    emodules:removeCommand("Depanneurs")
    emodules:removeCommand("Dropmoney")
    emodules:removeCommand("Camera")

    hook.Remove("HUDShouldDraw", "emodules:camera" )
    hook.Remove("PlayerButtonDown", "emodules:stopcams" )
end

t:End()

`